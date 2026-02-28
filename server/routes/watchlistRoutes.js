const express = require('express');
const router = express.Router();
const Watchlist = require('../models/Watchlist');
const { protect } = require('../middleware/authMiddleware');

// @desc    Get user's watchlist
// @route   GET /api/watchlist
// @access  Private
router.get('/', protect, async (req, res, next) => {
    try {
        let watchlist = await Watchlist.findOne({ userId: req.user._id }).populate(
            'stocks',
            'symbol companyName price change changePercent sector'
        );

        if (!watchlist) {
            watchlist = await Watchlist.create({
                userId: req.user._id,
                stocks: [],
            });
        }

        res.json({ success: true, data: watchlist });
    } catch (error) {
        next(error);
    }
});

// @desc    Add stock to watchlist
// @route   POST /api/watchlist/add
// @access  Private
router.post('/add', protect, async (req, res, next) => {
    try {
        const { stockId } = req.body;

        if (!stockId) {
            return res.status(400).json({
                success: false,
                message: 'Stock ID is required',
            });
        }

        let watchlist = await Watchlist.findOne({ userId: req.user._id });

        if (!watchlist) {
            watchlist = await Watchlist.create({
                userId: req.user._id,
                stocks: [stockId],
            });
        } else {
            if (watchlist.stocks.includes(stockId)) {
                return res.status(400).json({
                    success: false,
                    message: 'Stock already in watchlist',
                });
            }
            watchlist.stocks.push(stockId);
            await watchlist.save();
        }

        await watchlist.populate(
            'stocks',
            'symbol companyName price change changePercent sector'
        );

        res.status(201).json({ success: true, data: watchlist });
    } catch (error) {
        next(error);
    }
});

// @desc    Remove stock from watchlist
// @route   DELETE /api/watchlist/remove/:stockId
// @access  Private
router.delete('/remove/:stockId', protect, async (req, res, next) => {
    try {
        const watchlist = await Watchlist.findOne({ userId: req.user._id });

        if (!watchlist) {
            return res.status(404).json({
                success: false,
                message: 'Watchlist not found',
            });
        }

        watchlist.stocks = watchlist.stocks.filter(
            (s) => s.toString() !== req.params.stockId
        );
        await watchlist.save();

        await watchlist.populate(
            'stocks',
            'symbol companyName price change changePercent sector'
        );

        res.json({ success: true, data: watchlist });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
