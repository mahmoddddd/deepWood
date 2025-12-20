const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema(
  {
    name_en: {
      type: String,
      required: [true, 'English name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    name_ar: {
      type: String,
      required: [true, 'Arabic name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    title_en: {
      type: String,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    title_ar: {
      type: String,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    company_en: {
      type: String,
      maxlength: [100, 'Company name cannot exceed 100 characters'],
    },
    company_ar: {
      type: String,
      maxlength: [100, 'Company name cannot exceed 100 characters'],
    },
    content_en: {
      type: String,
      required: [true, 'English content is required'],
      maxlength: [1000, 'Content cannot exceed 1000 characters'],
    },
    content_ar: {
      type: String,
      required: [true, 'Arabic content is required'],
      maxlength: [1000, 'Content cannot exceed 1000 characters'],
    },
    // Customer avatar
    avatar: {
      url: String,
      publicId: String,
    },
    // Rating (1-5)
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 5,
    },
    // Related project (optional)
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
    },
    // Flags
    featured: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'pending'],
      default: 'pending',
    },
    // Order for sorting
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Testimonial', testimonialSchema);
