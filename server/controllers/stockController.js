const { validationResult } = require('express-validator');
const stockService = require('../services/stockService');

// @desc    Get all stocks
// @route   GET /api/stocks
// @access  Public
const getStocks = async (req, res, next) => {
    try {
        const result = await stockService.getAllStocks(req.query);
        res.json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single stock
// @route   GET /api/stocks/:id
// @access  Public
const getStockById = async (req, res, next) => {
    try {
        const stock = await stockService.getStockById(req.params.id);
        res.json({ success: true, data: stock });
    } catch (error) {
        next(error);
    }
};

// @desc    Get available sectors
// @route   GET /api/stocks/sectors
// @access  Public
const getSectors = async (req, res, next) => {
    try {
        const sectors = await stockService.getSectors();
        res.json({ success: true, data: sectors });
    } catch (error) {
        next(error);
    }
};

// @desc    Create a stock (admin only)
// @route   POST /api/stocks
// @access  Private/Admin
const createStock = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const stock = await stockService.createStock(req.body);
        res.status(201).json({ success: true, data: stock });
    } catch (error) {
        next(error);
    }
};

// @desc    Update a stock (admin only)
// @route   PUT /api/stocks/:id
// @access  Private/Admin
const updateStock = async (req, res, next) => {
    try {
        const stock = await stockService.updateStock(req.params.id, req.body);
        res.json({ success: true, data: stock });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete a stock (admin only)
// @route   DELETE /api/stocks/:id
// @access  Private/Admin
const deleteStock = async (req, res, next) => {
    try {
        const result = await stockService.deleteStock(req.params.id);
        res.json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getStocks,
    getStockById,
    getSectors,
    createStock,
    updateStock,
    deleteStock,
};
