const express = require('express');
const router = express.Router();
const { addGoldRate, getCurrentRate, getRateHistory, deleteGoldRate } = require('../controllers/goldRateController');

const authenticationMiddleware = require('../middlewares/authentication');

router.use(authenticationMiddleware);

router.post('/', addGoldRate);
router.get('/current', getCurrentRate);
router.get('/history', getRateHistory);
router.delete('/:id', deleteGoldRate);

module.exports = router;
