const mongoose = require('mongoose');

const silverRateSchema = new mongoose.Schema({
    ratePerGram: {
        type: Number,
        required: true,
        // Stored as integer/float.
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
        // Normalized date (set to midnight)
    },
    contributedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }
}, {
    timestamps: true,
});

// Enforce unique closing rate per day
silverRateSchema.index({ rateDate: 1, type: 1 }, { unique: true, partialFilterExpression: { type: 'CLOSING' } });

module.exports = mongoose.model('SilverRate', silverRateSchema);
