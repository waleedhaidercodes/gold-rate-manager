const express = require('express');
const router = express.Router();
const { addGoldRate, getCurrentRate, getRateHistory, deleteGoldRate } = require('../controllers/goldRateController');

router.post('/', addGoldRate);
router.get('/current', getCurrentRate);
router.get('/history', getRateHistory);
router.delete('/:id', deleteGoldRate);

module.exports = router;
