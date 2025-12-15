const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const {
  addInvestment,
  getInvestments,
  updateInvestment,
  deleteInvestment,
  uploadInvestments,
  downloadTemplate,
  exportInvestments,
} = require('../controllers/investmentController');

router.get('/template', downloadTemplate);
router.get('/export', exportInvestments);
router.post('/upload', upload.single('file'), uploadInvestments);
router.route('/').post(addInvestment).get(getInvestments);
router.route('/:id').put(updateInvestment).delete(deleteInvestment);

module.exports = router;
