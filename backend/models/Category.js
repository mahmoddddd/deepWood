const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
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
    description_en: {
      type: String,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    description_ar: {
      type: String,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    type: {
      type: String,
      enum: ['product', 'project', 'both'],
      default: 'both',
    },
    image: {
      url: String,
      publicId: String,
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
    order: {
      type: Number,
      default: 0,
    },
    seo: {
      metaTitle_en: String,
      metaTitle_ar: String,
      metaDescription_en: String,
      metaDescription_ar: String,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for product count
categorySchema.virtual('productCount', {
  ref: 'Product',
  localField: '_id',
  foreignField: 'category',
  count: true,
});

// Virtual for project count
categorySchema.virtual('projectCount', {
  ref: 'Project',
  localField: '_id',
  foreignField: 'category',
  count: true,
});

// Create slug from name before save
categorySchema.pre('save', function (next) {
  if (this.isModified('name_en') && !this.slug) {
    this.slug = this.name_en
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

module.exports = mongoose.model('Category', categorySchema);
