const mongoose = require('mongoose');

const goldRateSchema = new mongoose.Schema({
  ratePerGram: {
    type: Number,
    required: true,
    // Stored as integer (e.g., currency units or scaled). 
    // Application logic should handle scaling if needed.
  },
  type: {
    type: String,
    enum: ['CLOSING', 'INTRADAY'],
    required: true,
  },
  recordedAt: {
    type: Date,
    default: Date.now,
  },
  rateDate: {
    type: Date,
    required: true,
    // Normalized date (set to midnight) to enforce one closing rate per day
  },
  contributedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }
}, {
  timestamps: true,
});

// Enforce unique closing rate per day
goldRateSchema.index({ rateDate: 1, type: 1 }, { unique: true, partialFilterExpression: { type: 'CLOSING' } });

module.exports = mongoose.model('GoldRate', goldRateSchema);
