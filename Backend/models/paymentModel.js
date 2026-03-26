const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  provider: {
    type: String,
    enum: ['razorpay'],
    default: 'razorpay'
  },
  purpose: {
    type: String,
    enum: ['debt'],
    required: true
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  canteen: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Canteen',
    required: true
  },
  debt: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Debt',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: [1, 'Payment amount must be at least 1 rupee']
  },
  currency: {
    type: String,
    default: 'INR'
  },
  receipt: {
    type: String,
    required: true,
    unique: true
  },
  providerOrderId: {
    type: String,
    required: true,
    unique: true
  },
  providerPaymentId: {
    type: String,
    unique: true,
    sparse: true
  },
  providerKeyId: String,
  providerSignature: String,
  status: {
    type: String,
    enum: ['created', 'processing', 'paid', 'failed'],
    default: 'created'
  },
  settledAt: Date,
  failureReason: String
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
