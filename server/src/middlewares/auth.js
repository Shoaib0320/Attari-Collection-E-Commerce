import jwt from 'jsonwebtoken';

export const protect = (req, res, next) => {
	try {
		const token = req.cookies?.token || (req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.split(' ')[1] : null);
		if (!token) return res.status(401).json({ message: 'Not authorized, no token' });
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.user = { id: decoded.id, role: decoded.role };
		next();
	} catch (err) {
		return res.status(401).json({ message: 'Not authorized, token failed' });
	}
};

export const authorize = (...roles) => (req, res, next) => {
	if (!roles.includes(req.user?.role)) {
		return res.status(403).json({ message: 'Forbidden' });
	}
	next();
};
