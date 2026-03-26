const mongoose = require('mongoose');
const { encryptValue, decryptValue } = require('../utils/secretCrypto');

const KEY_ID_REGEX = /^rzp_(test|live)_[A-Za-z0-9]+$/;

const canteenSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A canteen must have a name']
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'A canteen must belong to an owner']
  },
  isOpen: {
    type: Boolean,
    default: false // Matches your React initial state logic
  },
  timings: {
    type: String,
    trim: true,
    default: '4:00 PM - 4:00 AM'
  },
  defaultLimit: {
    type: Number,
    default: 3000
  },
  razorpayMerchantKeyId: {
    type: String,
    trim: true,
    validate: {
      validator: (value) => !value || KEY_ID_REGEX.test(value),
      message: 'Please provide a valid Razorpay key ID.'
    }
  },
  razorpayMerchantKeySecretEncrypted: {
    type: String,
    select: false
  }
}, { timestamps: true });

canteenSchema.methods.setRazorpayMerchantKeySecret = function setRazorpayMerchantKeySecret(secret) {
  const trimmedSecret = (secret || '').trim();
  this.razorpayMerchantKeySecretEncrypted = trimmedSecret ? encryptValue(trimmedSecret) : undefined;
};

canteenSchema.methods.getRazorpayMerchantKeySecret = function getRazorpayMerchantKeySecret() {
  return this.razorpayMerchantKeySecretEncrypted
    ? decryptValue(this.razorpayMerchantKeySecretEncrypted)
    : '';
};

canteenSchema.methods.hasRazorpayMerchantCredentials = function hasRazorpayMerchantCredentials() {
  return Boolean(this.razorpayMerchantKeyId && this.razorpayMerchantKeySecretEncrypted);
};

module.exports = mongoose.model('Canteen', canteenSchema);
