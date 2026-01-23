const mongoose = require('mongoose');

const siteImageSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: [true, 'Image key is required'],
      unique: true,
    },
    src: {
      type: String,
      required: [true, 'Image source URL is required'],
    },
    publicId: {
      type: String,
      default: '',
    },
    alt_en: {
      type: String,
      default: '',
    },
    alt_ar: {
      type: String,
      default: '',
    },
    title_en: {
      type: String,
      default: '',
    },
    title_ar: {
      type: String,
      default: '',
    },
    description_en: {
      type: String,
      default: '',
    },
    description_ar: {
      type: String,
      default: '',
    },
    page: {
      type: String,
      required: [true, 'Page is required'],
      enum: ['home', 'about', 'gallery', 'services', 'contact', 'other'],
    },
    section: {
      type: String,
      required: [true, 'Section is required'],
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
siteImageSchema.index({ page: 1, section: 1 });
siteImageSchema.index({ key: 1 });

module.exports = mongoose.model('SiteImage', siteImageSchema);
