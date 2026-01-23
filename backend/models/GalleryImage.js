const mongoose = require('mongoose');

const galleryImageSchema = new mongoose.Schema(
  {
    src: {
      type: String,
      required: [true, 'Image source URL is required'],
    },
    publicId: {
      type: String,
      required: [true, 'Cloudinary public ID is required'],
    },
    alt: {
      type: String,
      default: '',
    },
    caption_en: {
      type: String,
      default: '',
    },
    caption_ar: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['living-room', 'bedroom', 'dining', 'office', 'kitchen'],
    },
    order: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries by category
galleryImageSchema.index({ category: 1, order: 1 });
galleryImageSchema.index({ status: 1 });

module.exports = mongoose.model('GalleryImage', galleryImageSchema);
