const { validationResult } = require('express-validator');
const transactionService = require('../services/transactionService');

// @desc    Buy stock
// @route   POST /api/transactions/buy
// @access  Private
const buyStock = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const { stockId, quantity } = req.body;
        const result = await transactionService.buyStock(
            req.user._id,
            stockId,
            Number(quantity)
        );

        res.status(201).json({
            success: true,
            message: 'Stock purchased successfully',
            data: result,
        });
    } catch (error) {
        if (error.statusCode) {
            res.status(error.statusCode);
        }
        next(error);
    }
};

// @desc    Sell stock
// @route   POST /api/transactions/sell
// @access  Private
const sellStock = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const { stockId, quantity } = req.body;
        const result = await transactionService.sellStock(
            req.user._id,
            stockId,
            Number(quantity)
        );

        res.status(200).json({
            success: true,
            message: 'Stock sold successfully',
            data: result,
        });
    } catch (error) {
        if (error.statusCode) {
            res.status(error.statusCode);
        }
        next(error);
    }
};

// @desc    Get transaction history
// @route   GET /api/transactions
// @access  Private
const getTransactions = async (req, res, next) => {
    try {
        const result = await transactionService.getTransactionHistory(
            req.user._id,
            req.query
        );
        res.json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
};

module.exports = { buyStock, sellStock, getTransactions };
