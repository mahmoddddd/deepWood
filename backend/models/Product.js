const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    title_en: {
      type: String,
      required: [true, 'English title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    title_ar: {
      type: String,
      required: [true, 'Arabic title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
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
    sku: {
      type: String,
      unique: true,
      trim: true,
      required: [true, 'SKU is required'],
      uppercase: true,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    salePrice: {
      type: Number,
      min: [0, 'Sale price cannot be negative'],
    },
    currency: {
      type: String,
      default: 'EGP',
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category is required'],
    },
    // Main image
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
    // Product video
    video: {
      url: String,
      publicId: String,
    },
    // Product specifications
    specifications: [
      {
        key_en: String,
        key_ar: String,
        value_en: String,
        value_ar: String,
      },
    ],
    // Dimensions
    dimensions: {
      width: Number,
      height: Number,
      depth: Number,
      unit: {
        type: String,
        default: 'cm',
      },
    },
    // Materials
    materials_en: [String],
    materials_ar: [String],

    // Variants: Colors
    colors: [
      {
        name_en: String,
        name_ar: String,
        hex: String,
      }
    ],
    // Variants: Sizes
    sizes: [
      {
        dimensions_en: String,
        dimensions_ar: String,
        price: Number,
        stock: {
           type: Number,
           default: 0
        },
      }
    ],
    // Stock
    inStock: {
      type: Boolean,
      default: true,
    },
    stockQuantity: {
      type: Number,
      default: 0,
    },
    // Flags
    featured: {
      type: Boolean,
      default: false,
    },
    isNew: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'draft'],
      default: 'draft',
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
      keywords_en: [String],
      keywords_ar: [String],
    },
    // Statistics
    views: {
      type: Number,
      default: 0,
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
      set: val => Math.round(val * 10) / 10,
    },
    ratingsQuantity: {
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

// Virtual populate
productSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'product',
  localField: '_id',
});

// Create slug from title before save
productSchema.pre('save', function (next) {
  if (this.isModified('title_en') && !this.slug) {
    this.slug = this.title_en
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

// Index for search
productSchema.index({ title_en: 'text', title_ar: 'text', description_en: 'text', description_ar: 'text' });

module.exports = mongoose.model('Product', productSchema);
