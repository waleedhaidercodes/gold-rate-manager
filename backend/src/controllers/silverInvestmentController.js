const SilverInvestment = require('../models/SilverInvestment');

// Conversion Constant
// 1 Tola = 11.664 Grams
// We store in MG (Milligrams) like Gold, or Grams? 
// Gold Investment stores in MG. To be consistent, let's store in MG.
// But the user said "buying silver in tola".
// Input: weightInTola.
// Stored: weightInGrams (as per schema I created).
// Actually schema said `weightInGrams` type Number.
// Let's store in Grams (float) for Silver as it's less precise than Gold usually? 
// Or stick to MG for consistency. Let's use MG.

// 1 Tola = 11.664 Grams = 11664 MG.

// @desc    Get all silver investments
// @route   GET /api/silver-investments
// @access  Private
const getInvestments = async (req, res) => {
    try {
        const investments = await SilverInvestment.find({ user: req.userId }).sort({ purchaseDate: -1 });
        res.json(investments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add a new silver investment
// @route   POST /api/silver-investments
// @access  Private
const addInvestment = async (req, res) => {
    try {
        const { weightInTola, buyRatePerTola, date, notes } = req.body;

        if (!weightInTola || !buyRatePerTola) {
            return res.status(400).json({ message: 'Please provide weight (in Tola) and rate (per Tola)' });
        }

        // Convert to standard units
        // Weight: Tola -> Grams. 1 Tola = 11.664 Grams.
        // Storing as Milligrams in DB to match Schema? 
        // Wait, recent schema creation for SilverInvestment had `weightInGrams`.
        // Let's store as Grams (Float) or Milligrams.
        // Let's store as Milligrams (Num) to be safe with float math, similar to Gold.
        const weightInGrams = parseFloat(weightInTola) * 11.664;
        const weightInMg = weightInGrams * 1000;

        // Rate: Per Tola -> Per Gram.
        // RatePerGram = RatePerTola / 11.664
        const buyRatePerGram = parseFloat(buyRatePerTola) / 11.664;

        const investment = await SilverInvestment.create({
            weightInGrams: weightInMg, // Saving in MG effectively if treating as such, or just Grams?
            // Re-reading Gold model: "weightInGrams ... Stored as milligrams". 
            // If I want to match that pattern:
            weightInGrams: weightInMg,

            buyRatePerGram,
            purchaseDate: date || Date.now(),
            notes,
            user: req.userId,
        });

        res.status(201).json(investment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a silver investment
// @route   DELETE /api/silver-investments/:id
// @access  Private
const deleteInvestment = async (req, res) => {
    try {
        const investment = await SilverInvestment.findById(req.params.id);

        if (!investment) {
            return res.status(404).json({ message: 'Investment not found' });
        }

        // Check user
        if (investment.user.toString() !== req.userId) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        await investment.deleteOne();
        res.json({ message: 'Investment removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getInvestments,
    addInvestment,
    deleteInvestment,
};
