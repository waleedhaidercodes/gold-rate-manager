const Investment = require('../models/Investment');
const XLSX = require('xlsx');
const fs = require('fs');

// @desc    Add a new investment
// @route   POST /api/investments
// @access  Public
const addInvestment = async (req, res) => {
  try {
    const { weightInGrams, buyRatePerGram, purchaseDate, notes } = req.body;

    if (!weightInGrams || !buyRatePerGram || !purchaseDate) {
      return res.status(400).json({ message: 'Please provide weight, rat, and date' });
    }

    const investment = await Investment.create({
      weightInGrams,
      buyRatePerGram,
      purchaseDate,
      notes,
      user: req.userId,
    });

    res.status(201).json(investment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all investments
// @route   GET /api/investments
// @access  Public
const getInvestments = async (req, res) => {
  try {
    const investments = await Investment.find({ user: req.userId }).sort({ purchaseDate: -1 });
    res.json(investments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update investment
// @route   PUT /api/investments/:id
// @access  Public
const updateInvestment = async (req, res) => {
  try {
    const investment = await Investment.findOne({ _id: req.params.id, user: req.userId });
    if (!investment) {
      return res.status(404).json({ message: 'Investment not found' });
    }

    const updatedInvestment = await Investment.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      req.body,
      { new: true }
    );
    res.json(updatedInvestment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete investment
// @route   DELETE /api/investments/:id
// @access  Public
const deleteInvestment = async (req, res) => {
  try {
    const investment = await Investment.findOne({ _id: req.params.id, user: req.userId });
    if (!investment) {
      return res.status(404).json({ message: 'Investment not found' });
    }

    await investment.deleteOne();
    res.json({ message: 'Investment removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const uploadInvestments = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  try {
    const workbook = XLSX.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet);

    const investments = [];
    const errors = [];

    for (const [index, row] of data.entries()) {
      // Expected headers: Date, Weight, Rate, Notes
      const purchaseDate = row['Date'] || row['date'];
      const weight = row['Weight'] || row['weight'];
      const buyRate = row['Buy Rate'] || row['buy rate'] || row['Rate'] || row['rate'];
      const notes = row['Notes'] || row['notes'] || '';

      if (!purchaseDate || !weight || !buyRate) {
        errors.push(`Row ${index + 2}: Missing required fields`);
        continue;
      }

      const weightInMg = parseFloat(weight) * 1000;
      
      // Formula: (RatePerTola / 11.664) * WeightInGrams
      // We store the Buy Rate as "Per Tola" (integer) directly.
      // The calculation happens on read/display or when needed.
      // OR, do we store the normalized per-gram rate?
      // User said: "I add 4 into weight and 363000 into rate" -> "I paid X to buy 4 gram"
      // It implies we should simply store the input values and do calc on fly, OR store the calculated total cost?
      // Best approach: Store exact inputs. 
      // buyRatePerGram field name is misleading now. Let's assume it stores "Rate Per Tola".
      
      investments.push({
        purchaseDate: new Date(purchaseDate),
        weightInGrams: weightInMg,
        buyRatePerGram: parseInt(buyRate), // Storing Rate Per Tola here
        notes,
        user: req.userId
      });
    }

    if (investments.length > 0) {
      await Investment.insertMany(investments);
    }

    fs.unlinkSync(req.file.path);

    res.status(201).json({ 
      message: `Successfully added ${investments.length} investments`,
      errors: errors.length > 0 ? errors : undefined
    });

  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    res.status(500).json({ message: error.message });
  }
};

const downloadTemplate = (req, res) => {
  try {
    const wb = XLSX.utils.book_new();
    const ws_data = [['Date', 'Weight', 'Rate', 'Notes'], ['2024-01-01', '10.5', '7500', 'Example Row']];
    const ws = XLSX.utils.aoa_to_sheet(ws_data);
    XLSX.utils.book_append_sheet(wb, ws, "Template");
    
    // Write to buffer
    const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
    
    res.setHeader('Content-Disposition', 'attachment; filename="Investment_Template.xlsx"');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buffer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const exportInvestments = async (req, res) => {
  try {
    const investments = await Investment.find({ user: req.userId }).sort({ purchaseDate: -1 });

    const data = investments.map(inv => ({
      Date: new Date(inv.purchaseDate).toISOString().split('T')[0],
      Weight: inv.weightInGrams / 1000,
      Rate: inv.buyRatePerGram, // Stored as Per Tola
      Notes: inv.notes || ''
    }));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, "Investments");

    const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

    res.setHeader('Content-Disposition', 'attachment; filename="Investments_Export.xlsx"');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buffer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addInvestment,
  getInvestments,
  updateInvestment,
  deleteInvestment,
  uploadInvestments,
  downloadTemplate,
  exportInvestments,
};
