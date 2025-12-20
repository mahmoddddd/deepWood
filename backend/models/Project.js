const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
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
      maxlength: [5000, 'Description cannot exceed 5000 characters'],
    },
    description_ar: {
      type: String,
      maxlength: [5000, 'Description cannot exceed 5000 characters'],
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
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
    },
    // Client reference (for corporate projects)
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Client',
    },
    // Project type
    projectType: {
      type: String,
      enum: ['residential', 'corporate', 'custom', 'antique'],
      default: 'residential',
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
        caption_en: String,
        caption_ar: String,
        order: Number,
      },
    ],
    // Before/After images
    beforeImage: {
      url: String,
      publicId: String,
    },
    afterImage: {
      url: String,
      publicId: String,
    },
    // Project video
    video: {
      url: String,
      publicId: String,
    },
    // Project details
    location_en: String,
    location_ar: String,
    completionDate: Date,
    duration: String,
    // Scope of work
    scope_en: [String],
    scope_ar: [String],
    // Challenges & solutions
    challenges_en: String,
    challenges_ar: String,
    solutions_en: String,
    solutions_ar: String,
    // Results
    results_en: String,
    results_ar: String,
    // Flags
    featured: {
      type: Boolean,
      default: false,
    },
    isCorporate: {
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
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Create slug from title before save
projectSchema.pre('save', function (next) {
  if (this.isModified('title_en') && !this.slug) {
    this.slug = this.title_en
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

// Index for search
projectSchema.index({ title_en: 'text', title_ar: 'text', description_en: 'text', description_ar: 'text' });

module.exports = mongoose.model('Project', projectSchema);
