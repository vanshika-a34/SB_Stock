const express = require('express');
const router = express.Router();
const {
    getStocks,
    getStockById,
    getSectors,
    createStock,
    updateStock,
    deleteStock,
} = require('../controllers/stockController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { stockValidation } = require('../utils/validators');

// Public routes
router.get('/', getStocks);
router.get('/sectors', getSectors);
router.get('/:id', getStockById);

// Admin routes
router.post('/', protect, authorize('admin'), stockValidation, createStock);
router.put('/:id', protect, authorize('admin'), updateStock);
router.delete('/:id', protect, authorize('admin'), deleteStock);

module.exports = router;
