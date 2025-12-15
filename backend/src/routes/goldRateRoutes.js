const express = require('express');
const router = express.Router();
const { addGoldRate, getCurrentRate, getRateHistory } = require('../controllers/goldRateController');

router.post('/', addGoldRate);
router.get('/current', getCurrentRate);
router.get('/history', getRateHistory);

module.exports = router;
