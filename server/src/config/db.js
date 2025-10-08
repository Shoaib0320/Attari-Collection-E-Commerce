import mongoose from 'mongoose';

const connectDB = async () => {
	const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/attari_collection';
	try {
		await mongoose.connect(mongoUri, {
			// modern mongoose uses the URI parser by default
		});
		console.log('MongoDB connected');
	} catch (err) {
		console.error('MongoDB connection error:', err.message);
		process.exit(1);
	}
};

export default connectDB;
