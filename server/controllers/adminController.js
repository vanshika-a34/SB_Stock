const User = require('../models/User');
const Stock = require('../models/Stock');
const Transaction = require('../models/Transaction');

// @desc    Get all users (admin only)
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = async (req, res, next) => {
    try {
        const users = await User.find()
            .select('-password')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: users,
            count: users.length,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getStats = async (req, res, next) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalStocks = await Stock.countDocuments({ isActive: true });
        const totalTransactions = await Transaction.countDocuments();

        // Recent transactions
        const recentTransactions = await Transaction.find()
            .populate('userId', 'name email')
            .populate('stockId', 'symbol companyName')
            .sort({ createdAt: -1 })
            .limit(10);

        // Transaction volume
        const buyVolume = await Transaction.aggregate([
            { $match: { type: 'buy' } },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } },
        ]);

        const sellVolume = await Transaction.aggregate([
            { $match: { type: 'sell' } },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } },
        ]);

        res.json({
            success: true,
            data: {
                totalUsers,
                totalStocks,
                totalTransactions,
                buyVolume: buyVolume[0]?.total || 0,
                sellVolume: sellVolume[0]?.total || 0,
                recentTransactions,
            },
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { getUsers, getStats };
