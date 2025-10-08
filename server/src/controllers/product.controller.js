import Product from '../models/Product.js';

export const listProducts = async (req, res) => {
	const { page = 1, limit = 12, q, category, subcategory, min, max, sort, featured, trending } = req.query;
	const filter = {};
	if (q) filter.title = { $regex: q, $options: 'i' };
	if (category) filter.category = category;
	if (subcategory) filter.subcategory = subcategory;
	if (featured) filter.featured = featured === 'true';
	if (trending) filter.trending = trending === 'true';
	if (min || max) filter.price = { ...(min && { $gte: Number(min) }), ...(max && { $lte: Number(max) }) };

	const sortMap = {
		'price_asc': { price: 1 },
		'price_desc': { price: -1 },
		'newest': { createdAt: -1 },
		'popular': { rating: -1 },
	};
	const sortOption = sortMap[sort] || { createdAt: -1 };

	const skip = (Number(page) - 1) * Number(limit);
	const [items, total] = await Promise.all([
		Product.find(filter).sort(sortOption).skip(skip).limit(Number(limit)),
		Product.countDocuments(filter),
	]);
	res.json({ items, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
};

export const getProduct = async (req, res) => {
	const item = await Product.findOne({ _id: req.params.id });
	if (!item) return res.status(404).json({ message: 'Product not found' });
	res.json({ item });
};

export const createProduct = async (req, res) => {
	const product = await Product.create(req.body);
	res.status(201).json({ item: product });
};

export const updateProduct = async (req, res) => {
	const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
	res.json({ item: updated });
};

export const deleteProduct = async (req, res) => {
	await Product.findByIdAndDelete(req.params.id);
	res.json({ ok: true });
};

export const relatedProducts = async (req, res) => {
	const { id } = req.params;
	const base = await Product.findById(id);
	if (!base) return res.status(404).json({ message: 'Product not found' });
	const items = await Product.find({
		_id: { $ne: base._id },
		category: base.category,
	}).limit(8);
	res.json({ items });
};

export default { listProducts, getProduct, createProduct, updateProduct, deleteProduct, relatedProducts };
