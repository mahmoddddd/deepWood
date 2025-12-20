const mongoose = require('mongoose');

const contactRequestSchema = new mongoose.Schema(
  {
    requestNumber: {
      type: String,
      unique: true,
    },
    // Contact type
    type: {
      type: String,
      enum: ['general', 'quotation', 'support', 'partnership'],
      default: 'general',
    },
    // Contact info
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
    },
    phone: {
      type: String,
    },
    company: {
      type: String,
    },
    // Message
    subject: {
      type: String,
      maxlength: [200, 'Subject cannot exceed 200 characters'],
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      maxlength: [5000, 'Message cannot exceed 5000 characters'],
    },
    // For quotation requests
    projectType: {
      type: String,
      enum: ['residential', 'corporate', 'custom', 'other'],
    },
    budget: {
      type: String,
    },
    timeline: {
      type: String,
    },
    // Attachments
    attachments: [
      {
        url: String,
        publicId: String,
        filename: String,
        type: String,
      },
    ],
    // Related entities
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
    },
    // Status
    status: {
      type: String,
      enum: ['new', 'read', 'replied', 'closed', 'spam'],
      default: 'new',
    },
    // Priority
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
    },
    // Admin notes
    adminNotes: String,
    // Assigned to
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    // Response
    response: {
      content: String,
      respondedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      respondedAt: Date,
    },
    // Language preference
    language: {
      type: String,
      enum: ['ar', 'en'],
      default: 'ar',
    },
    // Source
    source: {
      type: String,
      enum: ['website', 'whatsapp', 'phone', 'email', 'other'],
      default: 'website',
    },
    // IP and user agent for spam prevention
    ipAddress: String,
    userAgent: String,
  },
  {
    timestamps: true,
  }
);

// Generate request number before save
contactRequestSchema.pre('save', async function (next) {
  if (!this.requestNumber) {
    const count = await this.constructor.countDocuments();
    this.requestNumber = `REQ-${Date.now()}-${(count + 1).toString().padStart(4, '0')}`;
  }
  next();
});

module.exports = mongoose.model('ContactRequest', contactRequestSchema);
