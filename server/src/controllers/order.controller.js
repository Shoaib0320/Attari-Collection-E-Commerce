import Order from '../models/Order.js';

export const createOrder = async (req, res) => {
	const order = await Order.create({ ...req.body, user: req.user.id });
	res.status(201).json({ order });
};

export const listUserOrders = async (req, res) => {
	const orders = await Order.find({ user: req.params.id }).sort({ createdAt: -1 });
	res.json({ orders });
};

export const listAllOrders = async (req, res) => {
	const orders = await Order.find({}).sort({ createdAt: -1 });
	res.json({ orders });
};

export const updateStatus = async (req, res) => {
	const { status } = req.body;
	const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
	res.json({ order });
};

export const getInvoice = async (req, res) => {
	// TODO: generate and return invoice URL or PDF stream
	res.json({ url: null });
};

export default { createOrder, listUserOrders, listAllOrders, updateStatus, getInvoice };
