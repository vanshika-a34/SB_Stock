const express = require('express');
const router = express.Router();
const {
    buyStock,
    sellStock,
    getTransactions,
} = require('../controllers/transactionController');
const { protect } = require('../middleware/authMiddleware');
const { tradeValidation } = require('../utils/validators');

router.post('/buy', protect, tradeValidation, buyStock);
router.post('/sell', protect, tradeValidation, sellStock);
router.get('/', protect, getTransactions);

module.exports = router;
