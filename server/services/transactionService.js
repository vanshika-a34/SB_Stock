const User = require('../models/User');
const Stock = require('../models/Stock');
const Portfolio = require('../models/Portfolio');
const Transaction = require('../models/Transaction');

class TransactionService {
    async buyStock(userId, stockId, quantity) {
        const user = await User.findById(userId);
        const stock = await Stock.findById(stockId);

        if (!stock) {
            const error = new Error('Stock not found');
            error.statusCode = 404;
            throw error;
        }

        if (!stock.isActive) {
            const error = new Error('Stock is not available for trading');
            error.statusCode = 400;
            throw error;
        }

        const totalCost = stock.price * quantity;

        if (user.virtualBalance < totalCost) {
            const error = new Error(
                `Insufficient funds. Required: $${totalCost.toFixed(2)}, Available: $${user.virtualBalance.toFixed(2)}`
            );
            error.statusCode = 400;
            throw error;
        }

        // Deduct balance
        user.virtualBalance -= totalCost;
        await user.save();

        // Update or create portfolio
        let portfolio = await Portfolio.findOne({ userId });
        if (!portfolio) {
            portfolio = await Portfolio.create({ userId, holdings: [] });
        }

        // Check if stock already in holdings
        const holdingIndex = portfolio.holdings.findIndex(
            (h) => h.stockId.toString() === stockId
        );

        if (holdingIndex > -1) {
            // Update existing holding (weighted average price)
            const existing = portfolio.holdings[holdingIndex];
            const totalQty = existing.quantity + quantity;
            const totalCostBasis =
                existing.avgBuyPrice * existing.quantity + stock.price * quantity;
            existing.avgBuyPrice = totalCostBasis / totalQty;
            existing.quantity = totalQty;
        } else {
            // Add new holding
            portfolio.holdings.push({
                stockId: stock._id,
                symbol: stock.symbol,
                companyName: stock.companyName,
                quantity,
                avgBuyPrice: stock.price,
            });
        }

        // Recalculate total invested
        portfolio.totalInvested = portfolio.holdings.reduce(
            (sum, h) => sum + h.avgBuyPrice * h.quantity,
            0
        );
        await portfolio.save();

        // Record transaction
        const transaction = await Transaction.create({
            userId,
            stockId: stock._id,
            symbol: stock.symbol,
            type: 'buy',
            quantity,
            priceAtExecution: stock.price,
            totalAmount: totalCost,
        });

        return {
            transaction,
            newBalance: user.virtualBalance,
            portfolio,
        };
    }

    async sellStock(userId, stockId, quantity) {
        const user = await User.findById(userId);
        const stock = await Stock.findById(stockId);

        if (!stock) {
            const error = new Error('Stock not found');
            error.statusCode = 404;
            throw error;
        }

        // Check portfolio holdings
        const portfolio = await Portfolio.findOne({ userId });
        if (!portfolio) {
            const error = new Error('No portfolio found');
            error.statusCode = 400;
            throw error;
        }

        const holdingIndex = portfolio.holdings.findIndex(
            (h) => h.stockId.toString() === stockId
        );

        if (holdingIndex === -1) {
            const error = new Error('Stock not found in your portfolio');
            error.statusCode = 400;
            throw error;
        }

        const holding = portfolio.holdings[holdingIndex];

        if (holding.quantity < quantity) {
            const error = new Error(
                `Insufficient shares. You own ${holding.quantity} shares of ${stock.symbol}`
            );
            error.statusCode = 400;
            throw error;
        }

        const totalRevenue = stock.price * quantity;

        // Credit balance
        user.virtualBalance += totalRevenue;
        await user.save();

        // Update holdings
        holding.quantity -= quantity;
        if (holding.quantity === 0) {
            portfolio.holdings.splice(holdingIndex, 1);
        }

        // Recalculate total invested
        portfolio.totalInvested = portfolio.holdings.reduce(
            (sum, h) => sum + h.avgBuyPrice * h.quantity,
            0
        );
        await portfolio.save();

        // Record transaction
        const transaction = await Transaction.create({
            userId,
            stockId: stock._id,
            symbol: stock.symbol,
            type: 'sell',
            quantity,
            priceAtExecution: stock.price,
            totalAmount: totalRevenue,
        });

        return {
            transaction,
            newBalance: user.virtualBalance,
            portfolio,
        };
    }

    async getTransactionHistory(userId, query = {}) {
        const { type, page = 1, limit = 20 } = query;
        const filter = { userId };

        if (type) {
            filter.type = type;
        }

        const transactions = await Transaction.find(filter)
            .populate('stockId', 'symbol companyName price')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Transaction.countDocuments(filter);

        return {
            transactions,
            totalPages: Math.ceil(total / limit),
            currentPage: Number(page),
            total,
        };
    }
}

module.exports = new TransactionService();
