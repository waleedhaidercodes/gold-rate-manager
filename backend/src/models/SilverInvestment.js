const mongoose = require('mongoose');

const silverInvestmentSchema = new mongoose.Schema({
    weightInGrams: {
        type: Number,
        required: true,
        // Stored as milligrams (integer) or float grams? Gold uses milligrams.
        // Let's stick to consistency with Gold Investment if possible, but user asked for Tola.
        // We will convert Tola to Grams (or Milligrams) for storage.
        // 1 Tola = 11.664 Grams = 11664 Milligrams.
    },
    buyRatePerGram: {
        type: Number,
        required: true,
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

module.exports = mongoose.model('SilverInvestment', silverInvestmentSchema);
