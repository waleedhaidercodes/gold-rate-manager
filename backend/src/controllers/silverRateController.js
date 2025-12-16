const SilverRate = require('../models/SilverRate');

// @desc    Add a new silver rate
// @route   POST /api/silver-rates
// @access  Public
const addSilverRate = async (req, res) => {
    try {
        const { ratePerGram, type, date } = req.body;

        if (!ratePerGram || !type) {
            return res.status(400).json({ message: 'Please provide rate and type' });
        }

        const recordedAt = date ? new Date(date) : new Date();

        const rateDate = new Date(recordedAt);
        rateDate.setHours(0, 0, 0, 0);

        const silverRate = await SilverRate.create({
            ratePerGram,
            type,
            recordedAt,
            rateDate,
            contributedBy: req.userId,
        });

        res.status(201).json(silverRate);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Closing rate for this date already exists.' });
        }
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get latest CLOSING silver rate
// @route   GET /api/silver-rates/current
// @access  Public
const getCurrentRate = async (req, res) => {
    try {
        const rate = await SilverRate.findOne({ type: 'CLOSING' })
            .sort({ rateDate: -1 })
            .limit(1);

        if (!rate) {
            return res.status(404).json({ message: 'No closing silver rate found' });
        }

        res.json(rate);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get silver rate history (last 30 days)
// @route   GET /api/silver-rates/history
// @access  Public
const getRateHistory = async (req, res) => {
    try {
        const limit = parseInt(req.query.days) || 30;

        const rates = await SilverRate.find({ type: 'CLOSING' })
            .sort({ rateDate: -1 })
            .limit(limit);

        res.json(rates);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a silver rate
// @route   DELETE /api/silver-rates/:id
// @access  Public
const deleteSilverRate = async (req, res) => {
    try {
        const silverRate = await SilverRate.findById(req.params.id);

        if (!silverRate) {
            return res.status(404).json({ message: 'Silver rate not found' });
        }

        await silverRate.deleteOne();
        res.json({ message: 'Silver rate removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    addSilverRate,
    getCurrentRate,
    getRateHistory,
    deleteSilverRate,
};
