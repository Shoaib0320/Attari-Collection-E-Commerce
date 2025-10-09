import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const signToken = (user) => {
	return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_IN || '7d',
	});
};

const setAuthCookie = (res, token) => {
	res.cookie('token', token, {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
		maxAge: 7 * 24 * 60 * 60 * 1000,
	});
};

const setRoleCookie = (res, role) => {
	res.cookie('role', role || 'user', {
		httpOnly: false,
		secure: process.env.NODE_ENV === 'production',
		sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
		maxAge: 7 * 24 * 60 * 60 * 1000,
	});
};

export const register = async (req, res) => {
	const { name, email, password } = req.body;
	if (!name || !email || !password) return res.status(400).json({ message: 'All fields required' });
	const exists = await User.findOne({ email });
	if (exists) return res.status(409).json({ message: 'Email already in use' });
	const salt = await bcrypt.genSalt(10);
	const hash = await bcrypt.hash(password, salt);
	const user = await User.create({ name, email, password: hash });
	const token = signToken(user);
	setAuthCookie(res, token);
	setRoleCookie(res, user.role);
	res.status(201).json({
		user: { id: user._id, name: user.name, email: user.email, role: user.role },
		token,
	});
};

export const login = async (req, res) => {
	const { email, password } = req.body;
	const user = await User.findOne({ email });
	if (!user) return res.status(401).json({ message: 'Invalid credentials' });
	const match = await bcrypt.compare(password, user.password);
	if (!match) return res.status(401).json({ message: 'Invalid credentials' });
	const token = signToken(user);
	setAuthCookie(res, token);
	setRoleCookie(res, user.role);
	res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role }, token });
};

export const profile = async (req, res) => {
	const user = await User.findById(req.user.id).select('-password');
	res.json({ user });
};

export default { register, login, profile };
