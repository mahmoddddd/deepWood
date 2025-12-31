const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema(
  {
    storeName: {
      type: String,
      default: 'Deep Wood',
    },
    logo: {
      url: String,
      publicId: String,
    },
    favicon: {
      url: String,
      publicId: String,
    },
    contactEmail: String,
    contactPhone: String,
    whatsappNumber: String,
    address: String,
    socialLinks: {
      facebook: String,
      instagram: String,
      twitter: String,
      linkedin: String,
    },
    currency: {
      type: String,
      default: 'EGP',
    },
    shippingCost: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Settings', settingsSchema);
