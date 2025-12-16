const express = require('express');
const router = express.Router();
const { getInvestments, addInvestment, deleteInvestment } = require('../controllers/silverInvestmentController');

const authenticationMiddleware = require('../middlewares/authentication');

router.use(authenticationMiddleware);

router.get('/', getInvestments);
router.post('/', addInvestment);
router.delete('/:id', deleteInvestment);

module.exports = router;
