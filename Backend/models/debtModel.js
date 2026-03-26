const mongoose = require('mongoose');

/**
 * @desc Mongoose schema representing the financial relationship (Khata) 
 * between a specific student and a specific canteen.
 */
const debtSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'A debt record must be associated with a student.']
  },
  canteen: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Canteen',
    required: [true, 'A debt record must be associated with a canteen.']
  },
  amountOwed: {
    type: Number,
    default: 0,
    min: [0, 'Debt amount cannot be negative.']
  },
  limit: {
    type: Number,
    default: 3000,
    min: [0, 'Credit limit cannot be negative.']
  }
}, { 
  timestamps: true 
});

// ==========================================
// DATABASE INDEXES
// ==========================================

// Enforce a strict 1:1 relationship per canteen: 
// A student can only have ONE active debt tracking document per shop.
debtSchema.index({ student: 1, canteen: 1 }, { unique: true });

module.exports = mongoose.model('Debt', debtSchema);