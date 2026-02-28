const Portfolio = require('../models/Portfolio');
const Stock = require('../models/Stock');

// @desc    Get current user's portfolio
// @route   GET /api/portfolio
// @access  Private
const getPortfolio = async (req, res, next) => {
    try {
        let portfolio = await Portfolio.findOne({ userId: req.user._id }).populate(
            'holdings.stockId',
            'symbol companyName price change changePercent'
        );

        if (!portfolio) {
            portfolio = await Portfolio.create({
                userId: req.user._id,
                holdings: [],
            });
        }

        // Calculate current values
        let totalCurrentValue = 0;
        const enrichedHoldings = portfolio.holdings.map((holding) => {
            const currentPrice = holding.stockId
                ? holding.stockId.price
                : holding.avgBuyPrice;
            const currentValue = currentPrice * holding.quantity;
            const investedValue = holding.avgBuyPrice * holding.quantity;
            const profitLoss = currentValue - investedValue;
            const profitLossPercent =
                investedValue > 0 ? ((profitLoss / investedValue) * 100).toFixed(2) : 0;

            totalCurrentValue += currentValue;

            return {
                stockId: holding.stockId?._id || holding.stockId,
                symbol: holding.symbol,
                companyName: holding.companyName,
                quantity: holding.quantity,
                avgBuyPrice: holding.avgBuyPrice,
                currentPrice,
                currentValue,
                investedValue,
                profitLoss,
                profitLossPercent: Number(profitLossPercent),
            };
        });

        res.json({
            success: true,
            data: {
                holdings: enrichedHoldings,
                totalInvested: portfolio.totalInvested,
                totalCurrentValue,
                totalProfitLoss: totalCurrentValue - portfolio.totalInvested,
                availableBalance: req.user.virtualBalance,
            },
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { getPortfolio };
