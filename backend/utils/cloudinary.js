const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload a file to Cloudinary
 * @param {string} filePath - Local file path or base64 string
 * @param {string} folder - Cloudinary folder name
 * @param {string} resourceType - 'image' or 'video'
 * @returns {Promise<{url: string, publicId: string}>}
 */
const uploadToCloudinary = async (filePath, folder = 'deepwood', resourceType = 'image') => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: folder,
      resource_type: resourceType,
      transformation: resourceType === 'image' ? [
        { quality: 'auto', fetch_format: 'auto' }
      ] : undefined,
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload file to Cloudinary');
  }
};

/**
 * Delete a file from Cloudinary
 * @param {string} publicId - Cloudinary public ID
 * @param {string} resourceType - 'image' or 'video'
 * @returns {Promise<boolean>}
 */
const deleteFromCloudinary = async (publicId, resourceType = 'image') => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
    return result.result === 'ok';
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw new Error('Failed to delete file from Cloudinary');
  }
};

/**
 * Upload multiple files to Cloudinary
 * @param {Array<string>} filePaths - Array of file paths
 * @param {string} folder - Cloudinary folder name
 * @param {string} resourceType - 'image' or 'video'
 * @returns {Promise<Array<{url: string, publicId: string}>>}
 */
const uploadMultipleToCloudinary = async (filePaths, folder = 'deepwood', resourceType = 'image') => {
  const uploadPromises = filePaths.map(filePath =>
    uploadToCloudinary(filePath, folder, resourceType)
  );
  return Promise.all(uploadPromises);
};

/**
 * Delete multiple files from Cloudinary
 * @param {Array<string>} publicIds - Array of Cloudinary public IDs
 * @param {string} resourceType - 'image' or 'video'
 * @returns {Promise<boolean>}
 */
const deleteMultipleFromCloudinary = async (publicIds, resourceType = 'image') => {
  try {
    const result = await cloudinary.api.delete_resources(publicIds, {
      resource_type: resourceType,
    });
    return true;
  } catch (error) {
    console.error('Cloudinary bulk delete error:', error);
    throw new Error('Failed to delete files from Cloudinary');
  }
};

module.exports = {
  cloudinary,
  uploadToCloudinary,
  deleteFromCloudinary,
  uploadMultipleToCloudinary,
  deleteMultipleFromCloudinary,
};
