const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
  {
    title_en: {
      type: String,
      required: [true, 'English title is required'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    title_ar: {
      type: String,
      required: [true, 'Arabic title is required'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    description_en: {
      type: String,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    description_ar: {
      type: String,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    shortDescription_en: {
      type: String,
      maxlength: [300, 'Short description cannot exceed 300 characters'],
    },
    shortDescription_ar: {
      type: String,
      maxlength: [300, 'Short description cannot exceed 300 characters'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    // Icon (font icon class or image)
    icon: {
      type: String,
    },
    // Service image
    image: {
      url: String,
      publicId: String,
    },
    // Gallery images
    gallery: [
      {
        url: String,
        publicId: String,
        order: Number,
      },
    ],
    // Features/Benefits
    features_en: [String],
    features_ar: [String],
    // Process steps
    process: [
      {
        step: Number,
        title_en: String,
        title_ar: String,
        description_en: String,
        description_ar: String,
      },
    ],
    // Flags
    featured: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
    // Order for sorting
    order: {
      type: Number,
      default: 0,
    },
    // SEO
    seo: {
      metaTitle_en: String,
      metaTitle_ar: String,
      metaDescription_en: String,
      metaDescription_ar: String,
    },
  },
  {
    timestamps: true,
  }
);

// Create slug from title before save
serviceSchema.pre('save', function (next) {
  if (this.isModified('title_en') && !this.slug) {
    this.slug = this.title_en
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

module.exports = mongoose.model('Service', serviceSchema);
