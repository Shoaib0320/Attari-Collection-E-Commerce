export const notFound = (err, req, res, next) => {
	next(err);
};

export const errorHandler = (err, req, res, next) => {
	const statusCode = err.status || err.statusCode || 500;
	const message = err.message || 'Internal Server Error';
	if (process.env.NODE_ENV !== 'production') {
		console.error(err);
	}
	res.status(statusCode).json({
		success: false,
		message,
		stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
	});
};
