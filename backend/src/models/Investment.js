const mongoose = require('mongoose');

const investmentSchema = new mongoose.Schema({
  weightInGrams: {
    type: Number,
    required: true,
    // Stored as milligrams (integer) to avoid floating point issues
  },
  buyRatePerGram: {
    type: Number,
    required: true,
    // Stored as integer
  },
  purchaseDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  notes: {
    type: String,
    trim: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }
}, {
  timestamps: true,
});

module.exports = mongoose.model('Investment', investmentSchema);
