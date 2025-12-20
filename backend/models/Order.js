const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  title_en: String,
  title_ar: String,
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  image: String,
});

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
    },
    // Customer info
    customerName: {
      type: String,
      required: [true, 'Customer name is required'],
    },
    customerEmail: {
      type: String,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
    },
    customerPhone: {
      type: String,
      required: [true, 'Customer phone is required'],
    },
    // Shipping address
    shippingAddress: {
      street: String,
      city: String,
      governorate: String,
      postalCode: String,
      country: {
        type: String,
        default: 'Egypt',
      },
    },
    // Order items
    items: [orderItemSchema],
    // Pricing
    subtotal: {
      type: Number,
      required: true,
    },
    shippingCost: {
      type: Number,
      default: 0,
    },
    discount: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'EGP',
    },
    // Order status
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    // Payment
    paymentMethod: {
      type: String,
      enum: ['cod', 'card', 'whatsapp'],
      default: 'whatsapp',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },
    // WhatsApp order
    whatsappOrderId: String,
    // Notes
    customerNotes: String,
    adminNotes: String,
    // Tracking
    trackingNumber: String,
    shippedAt: Date,
    deliveredAt: Date,
    // Language preference
    language: {
      type: String,
      enum: ['ar', 'en'],
      default: 'ar',
    },
  },
  {
    timestamps: true,
  }
);

// Generate order number before save
orderSchema.pre('save', async function (next) {
  if (!this.orderNumber) {
    const count = await this.constructor.countDocuments();
    this.orderNumber = `DW-${Date.now()}-${(count + 1).toString().padStart(4, '0')}`;
  }
  next();
});

// Calculate total before save
orderSchema.pre('save', function (next) {
  if (this.isModified('items') || this.isModified('shippingCost') || this.isModified('discount')) {
    this.subtotal = this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    this.total = this.subtotal + this.shippingCost - this.discount;
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
