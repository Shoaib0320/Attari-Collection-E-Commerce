import { v2 as cloudinary } from 'cloudinary';

export const configureCloudinary = () => {
	const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
	if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
		console.warn('Cloudinary env vars missing; media upload will be disabled.');
		return;
	}
	cloudinary.config({
		cloud_name: CLOUDINARY_CLOUD_NAME,
		api_key: CLOUDINARY_API_KEY,
		api_secret: CLOUDINARY_API_SECRET,
		secure: true,
	});
};

export const uploadImage = async (filePath, options = {}) => {
	return cloudinary.uploader.upload(filePath, { folder: 'attari-collection', ...options });
};

export const deleteAsset = async (publicId) => {
	return cloudinary.uploader.destroy(publicId);
};

export default cloudinary;
