const GoldRate = require('../models/GoldRate');

// @desc    Add a new gold rate
// @route   POST /api/gold-rates
// @access  Public
const addGoldRate = async (req, res) => {
  try {
    const { ratePerGram, type, date } = req.body;

    if (!ratePerGram || !type) {
      return res.status(400).json({ message: 'Please provide rate and type' });
    }

    const recordedAt = date ? new Date(date) : new Date();
    
    // Normalize date for uniqueness check (set to midnight local/system time)
    // Create a new date object to allow manipulation without affecting recordedAt if it were same ref
    const rateDate = new Date(recordedAt);
    rateDate.setHours(0, 0, 0, 0);

    const goldRate = await GoldRate.create({
      ratePerGram,
      type,
      recordedAt,
      rateDate,
    });

    res.status(201).json(goldRate);
  } catch (error) {
    if (error.code === 11000) {
      // Duplicate key error (likely closing rate for same day)
      return res.status(400).json({ message: 'Closing rate for this date already exists.' });
    }
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get latest CLOSING gold rate
// @route   GET /api/gold-rates/current
// @access  Public
const getCurrentRate = async (req, res) => {
  try {
    const rate = await GoldRate.findOne({ type: 'CLOSING' })
      .sort({ rateDate: -1 })
      .limit(1);

    if (!rate) {
      return res.status(404).json({ message: 'No closing rate found' });
    }

    res.json(rate);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get gold rate history (last 30 days)
// @route   GET /api/gold-rates/history
// @access  Public
const getRateHistory = async (req, res) => {
  try {
    const limit = parseInt(req.query.days) || 30;
    
    const rates = await GoldRate.find({ type: 'CLOSING' })
      .sort({ rateDate: -1 })
      .limit(limit);

    res.json(rates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addGoldRate,
  getCurrentRate,
  getRateHistory,
};
