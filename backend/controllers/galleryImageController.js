const GalleryImage = require('../models/GalleryImage');
const { uploadToCloudinary, deleteFromCloudinary } = require('../utils/cloudinary');

// @desc    Get all gallery images
// @route   GET /api/gallery
// @access  Public
const getGalleryImages = async (req, res) => {
  try {
    const { category, status } = req.query;

    const filter = {};
    if (category) filter.category = category;
    if (status) filter.status = status;
    else filter.status = 'active'; // Default to active images for public

    const images = await GalleryImage.find(filter).sort({ category: 1, order: 1 });

    // Group by category for easier frontend consumption
    const grouped = images.reduce((acc, img) => {
      if (!acc[img.category]) {
        acc[img.category] = [];
      }
      acc[img.category].push(img);
      return acc;
    }, {});

    res.status(200).json({
      success: true,
      count: images.length,
      data: images,
      grouped,
    });
  } catch (error) {
    console.error('Get gallery images error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error',
    });
  }
};

// @desc    Get single gallery image
// @route   GET /api/gallery/:id
// @access  Public
const getGalleryImage = async (req, res) => {
  try {
    const image = await GalleryImage.findById(req.params.id);

    if (!image) {
      return res.status(404).json({
        success: false,
        error: 'Image not found',
      });
    }

    res.status(200).json({
      success: true,
      data: image,
    });
  } catch (error) {
    console.error('Get gallery image error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error',
    });
  }
};

// @desc    Create gallery image
// @route   POST /api/gallery
// @access  Admin
const createGalleryImage = async (req, res) => {
  try {
    const { category, alt, caption_en, caption_ar, order } = req.body;

    // Check if image file is uploaded
    if (!req.file && !req.body.src) {
      return res.status(400).json({
        success: false,
        error: 'Please upload an image or provide an image URL',
      });
    }

    let imageData = {};

    if (req.file) {
      // Upload to Cloudinary
      const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
      const uploadResult = await uploadToCloudinary(base64Image, `deepwood/gallery/${category}`);
      imageData = {
        src: uploadResult.url,
        publicId: uploadResult.publicId,
      };
    } else {
      // Use provided URL (for seeding or external images)
      imageData = {
        src: req.body.src,
        publicId: req.body.publicId || '',
      };
    }

    const image = await GalleryImage.create({
      ...imageData,
      category,
      alt: alt || `${category} image`,
      caption_en: caption_en || '',
      caption_ar: caption_ar || '',
      order: order || 0,
    });

    res.status(201).json({
      success: true,
      data: image,
    });
  } catch (error) {
    console.error('Create gallery image error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error',
    });
  }
};

// @desc    Update gallery image
// @route   PUT /api/gallery/:id
// @access  Admin
const updateGalleryImage = async (req, res) => {
  try {
    const { alt, caption_en, caption_ar, category, order, status } = req.body;

    let image = await GalleryImage.findById(req.params.id);

    if (!image) {
      return res.status(404).json({
        success: false,
        error: 'Image not found',
      });
    }

    // If a new image file is uploaded, replace the old one
    if (req.file) {
      // Delete old image from Cloudinary if it has a publicId
      if (image.publicId) {
        await deleteFromCloudinary(image.publicId);
      }

      // Upload new image
      const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
      const uploadResult = await uploadToCloudinary(base64Image, `deepwood/gallery/${category || image.category}`);

      image.src = uploadResult.url;
      image.publicId = uploadResult.publicId;
    }

    // Update fields
    if (alt !== undefined) image.alt = alt;
    if (caption_en !== undefined) image.caption_en = caption_en;
    if (caption_ar !== undefined) image.caption_ar = caption_ar;
    if (category !== undefined) image.category = category;
    if (order !== undefined) image.order = order;
    if (status !== undefined) image.status = status;

    await image.save();

    res.status(200).json({
      success: true,
      data: image,
    });
  } catch (error) {
    console.error('Update gallery image error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error',
    });
  }
};

// @desc    Delete gallery image
// @route   DELETE /api/gallery/:id
// @access  Admin
const deleteGalleryImage = async (req, res) => {
  try {
    const image = await GalleryImage.findById(req.params.id);

    if (!image) {
      return res.status(404).json({
        success: false,
        error: 'Image not found',
      });
    }

    // Delete from Cloudinary if it has a publicId
    if (image.publicId) {
      try {
        await deleteFromCloudinary(image.publicId);
      } catch (cloudinaryError) {
        console.error('Cloudinary delete error:', cloudinaryError);
        // Continue with database deletion even if Cloudinary fails
      }
    }

    await GalleryImage.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    console.error('Delete gallery image error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error',
    });
  }
};

// @desc    Bulk create gallery images (for seeding)
// @route   POST /api/gallery/bulk
// @access  Admin
const bulkCreateGalleryImages = async (req, res) => {
  try {
    const { images } = req.body;

    if (!images || !Array.isArray(images)) {
      return res.status(400).json({
        success: false,
        error: 'Please provide an array of images',
      });
    }

    const createdImages = await GalleryImage.insertMany(images);

    res.status(201).json({
      success: true,
      count: createdImages.length,
      data: createdImages,
    });
  } catch (error) {
    console.error('Bulk create gallery images error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error',
    });
  }
};

module.exports = {
  getGalleryImages,
  getGalleryImage,
  createGalleryImage,
  updateGalleryImage,
  deleteGalleryImage,
  bulkCreateGalleryImages,
};
