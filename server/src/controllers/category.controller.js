import Category from '../models/Category.js';

export const listCategories = async (req, res) => {
	const categories = await Category.find({});
	res.json({ categories });
};

export const createCategory = async (req, res) => {
	const cat = await Category.create(req.body);
	res.status(201).json({ category: cat });
};

export const updateCategory = async (req, res) => {
	const cat = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
	res.json({ category: cat });
};

export const deleteCategory = async (req, res) => {
	await Category.findByIdAndDelete(req.params.id);
	res.json({ ok: true });
};

export const listSubcategories = async (req, res) => {
	const cat = await Category.findById(req.params.id);
	if (!cat) return res.status(404).json({ message: 'Category not found' });
	res.json({ subcategories: cat.subcategories || [] });
};

export default { listCategories, createCategory, updateCategory, deleteCategory, listSubcategories };
