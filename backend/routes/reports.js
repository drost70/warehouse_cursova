const express = require('express');
const router = express.Router();
const reportsController = require('../controllers/reportsController');

router.get('/valuation', reportsController.getValuation);

router.get('/stock', reportsController.getStockOnDate);

module.exports = router;
