import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		email: { type: String, required: true, unique: true, lowercase: true, index: true },
		password: { type: String, required: true },
		role: { type: String, enum: ['user', 'admin'], default: 'user' },
		addresses: [
			{
				fullName: String,
				phone: String,
				addressLine1: String,
				addressLine2: String,
				city: String,
				state: String,
				postalCode: String,
				country: String,
				isDefault: { type: Boolean, default: false },
			},
		],
		isActive: { type: Boolean, default: true },
	},
	{ timestamps: true }
);

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;
