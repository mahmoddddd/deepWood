const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema(
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
    // Client logo
    logo: {
      url: String,
      publicId: String,
    },
    // Website
    website: {
      type: String,
    },
    // Industry
    industry_en: String,
    industry_ar: String,
    // Is this a major/featured client?
    featured: {
      type: Boolean,
      default: false,
    },
    // Is this a corporate client?
    isCorporate: {
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
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for projects count
clientSchema.virtual('projectCount', {
  ref: 'Project',
  localField: '_id',
  foreignField: 'client',
  count: true,
});

// Create slug from name before save
clientSchema.pre('save', function (next) {
  if (this.isModified('name_en') && !this.slug) {
    this.slug = this.name_en
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

module.exports = mongoose.model('Client', clientSchema);
