const SiteImage = require('../models/SiteImage');
const { uploadToCloudinary, deleteFromCloudinary } = require('../utils/cloudinary');

// @desc    Get all site images
// @route   GET /api/site-images
// @access  Public
const getSiteImages = async (req, res) => {
  try {
    const { page, section, key } = req.query;

    const filter = { isActive: true };
    if (page) filter.page = page;
    if (section) filter.section = section;
    if (key) filter.key = key;

    const images = await SiteImage.find(filter).sort({ page: 1, section: 1, order: 1 });

    res.status(200).json({
      success: true,
      count: images.length,
      data: images,
    });
  } catch (error) {
    console.error('Get site images error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error',
    });
  }
};

// @desc    Get site image by key
// @route   GET /api/site-images/key/:key
// @access  Public
const getSiteImageByKey = async (req, res) => {
  try {
    const image = await SiteImage.findOne({ key: req.params.key });

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
    console.error('Get site image by key error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error',
    });
  }
};

// @desc    Get single site image
// @route   GET /api/site-images/:id
// @access  Public
const getSiteImage = async (req, res) => {
  try {
    const image = await SiteImage.findById(req.params.id);

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
    console.error('Get site image error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error',
    });
  }
};

// @desc    Create site image
// @route   POST /api/site-images
// @access  Admin
const createSiteImage = async (req, res) => {
  try {
    const { key, page, section, alt_en, alt_ar, title_en, title_ar, description_en, description_ar, order } = req.body;

    // Check if key already exists
    const existing = await SiteImage.findOne({ key });
    if (existing) {
      return res.status(400).json({
        success: false,
        error: 'An image with this key already exists',
      });
    }

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
      const uploadResult = await uploadToCloudinary(base64Image, `deepwood/site/${page}`);
      imageData = {
        src: uploadResult.url,
        publicId: uploadResult.publicId,
      };
    } else {
      // Use provided URL
      imageData = {
        src: req.body.src,
        publicId: req.body.publicId || '',
      };
    }

    const image = await SiteImage.create({
      ...imageData,
      key,
      page,
      section,
      alt_en: alt_en || '',
      alt_ar: alt_ar || '',
      title_en: title_en || '',
      title_ar: title_ar || '',
      description_en: description_en || '',
      description_ar: description_ar || '',
      order: order || 0,
    });

    res.status(201).json({
      success: true,
      data: image,
    });
  } catch (error) {
    console.error('Create site image error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error',
    });
  }
};

// @desc    Update site image
// @route   PUT /api/site-images/:id
// @access  Admin
const updateSiteImage = async (req, res) => {
  try {
    const { alt_en, alt_ar, title_en, title_ar, description_en, description_ar, page, section, order, isActive } = req.body;

    let image = await SiteImage.findById(req.params.id);

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
        try {
          await deleteFromCloudinary(image.publicId);
        } catch (e) {
          console.error('Failed to delete old image:', e);
        }
      }

      // Upload new image
      const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
      const uploadResult = await uploadToCloudinary(base64Image, `deepwood/site/${page || image.page}`);

      image.src = uploadResult.url;
      image.publicId = uploadResult.publicId;
    }

    // Update fields
    if (alt_en !== undefined) image.alt_en = alt_en;
    if (alt_ar !== undefined) image.alt_ar = alt_ar;
    if (title_en !== undefined) image.title_en = title_en;
    if (title_ar !== undefined) image.title_ar = title_ar;
    if (description_en !== undefined) image.description_en = description_en;
    if (description_ar !== undefined) image.description_ar = description_ar;
    if (page !== undefined) image.page = page;
    if (section !== undefined) image.section = section;
    if (order !== undefined) image.order = order;
    if (isActive !== undefined) image.isActive = isActive;

    await image.save();

    res.status(200).json({
      success: true,
      data: image,
    });
  } catch (error) {
    console.error('Update site image error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error',
    });
  }
};

// @desc    Delete site image
// @route   DELETE /api/site-images/:id
// @access  Admin
const deleteSiteImage = async (req, res) => {
  try {
    const image = await SiteImage.findById(req.params.id);

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
      }
    }

    await SiteImage.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    console.error('Delete site image error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error',
    });
  }
};

// @desc    Seed initial site images
// @route   POST /api/site-images/seed
// @access  Admin
const seedSiteImages = async (req, res) => {
  try {
    const existingCount = await SiteImage.countDocuments();
    if (existingCount > 0) {
      return res.status(400).json({
        success: false,
        error: 'Site images already seeded. Use force=true query param to override.',
      });
    }

    const defaultImages = [
      {
        key: 'hero-main',
        src: 'https://res.cloudinary.com/dlxqm1tkd/image/upload/v1766788312/deepwood/furniture/lbm91hl0sleqatdonxsz.jpg',
        alt_en: 'Deep Wood Furniture',
        alt_ar: 'أثاث ديب وود',
        title_en: 'Hero Background',
        title_ar: 'خلفية الهيرو',
        page: 'home',
        section: 'hero',
        order: 0,
      },
      {
        key: 'before-after-1-before',
        src: '/imagesss/animation/before1.jpeg',
        alt_en: 'Before transformation',
        alt_ar: 'قبل التحويل',
        title_en: 'Living Room - Before',
        title_ar: 'غرفة المعيشة - قبل',
        page: 'home',
        section: 'before-after',
        order: 0,
      },
      {
        key: 'before-after-1-after',
        src: '/imagesss/animation/after-1.jpeg',
        alt_en: 'After transformation',
        alt_ar: 'بعد التحويل',
        title_en: 'Living Room - After',
        title_ar: 'غرفة المعيشة - بعد',
        page: 'home',
        section: 'before-after',
        order: 1,
      },
      {
        key: 'before-after-2-before',
        src: '/imagesss/animation/before2.jpg',
        alt_en: 'Before transformation',
        alt_ar: 'قبل التحويل',
        title_en: 'Antique Restoration - Before',
        title_ar: 'ترميم الأنتيكات - قبل',
        page: 'home',
        section: 'before-after',
        order: 2,
      },
      {
        key: 'before-after-2-after',
        src: '/imagesss/animation/after-2.jpeg',
        alt_en: 'After transformation',
        alt_ar: 'بعد التحويل',
        title_en: 'Antique Restoration - After',
        title_ar: 'ترميم الأنتيكات - بعد',
        page: 'home',
        section: 'before-after',
        order: 3,
      },
    ];

    const createdImages = await SiteImage.insertMany(defaultImages);

    res.status(201).json({
      success: true,
      count: createdImages.length,
      data: createdImages,
    });
  } catch (error) {
    console.error('Seed site images error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error',
    });
  }
};

module.exports = {
  getSiteImages,
  getSiteImageByKey,
  getSiteImage,
  createSiteImage,
  updateSiteImage,
  deleteSiteImage,
  seedSiteImages,
};
