const express = require('express');
const router = express.Router();
const { addSilverRate, getCurrentRate, getRateHistory, deleteSilverRate } = require('../controllers/silverRateController');
const authenticationMiddleware = require('../middlewares/authentication');

router.use(authenticationMiddleware);

router.post('/', addSilverRate);
router.get('/current', getCurrentRate);
router.get('/history', getRateHistory);
router.delete('/:id', deleteSilverRate);

module.exports = router;
