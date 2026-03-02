const Stock = require('../models/Stock');
const { runSeed } = require('../seed');

class StockService {
    async getAllStocks(query = {}) {
        const { sector, search, page = 1, limit = 20 } = query;
        const filter = { isActive: true };

        if (sector) {
            filter.sector = sector;
        }

        if (search) {
            filter.$or = [
                { symbol: { $regex: search, $options: 'i' } },
                { companyName: { $regex: search, $options: 'i' } },
            ];
        }

        let total = await Stock.countDocuments(filter);

        // Auto-seed initial stocks if database is empty (useful for fresh setups)
        if (total === 0) {
            await runSeed();
            total = await Stock.countDocuments(filter);
        }

        const stocks = await Stock.find(filter)
            .sort({ symbol: 1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        return {
            stocks,
            totalPages: Math.ceil(total / limit) || 1,
            currentPage: Number(page),
            total,
        };
    }

    async getStockById(id) {
        const stock = await Stock.findById(id);
        if (!stock) {
            const error = new Error('Stock not found');
            error.statusCode = 404;
            throw error;
        }
        return stock;
    }

    async createStock(data) {
        const stock = await Stock.create(data);
        return stock;
    }

    async updateStock(id, data) {
        const stock = await Stock.findById(id);
        if (!stock) {
            const error = new Error('Stock not found');
            error.statusCode = 404;
            throw error;
        }

        // Save previous price before updating
        if (data.price && data.price !== stock.price) {
            stock.previousPrice = stock.price;
            stock.historicalData.push({
                date: new Date(),
                price: stock.price,
                volume: stock.volume,
            });
        }

        Object.assign(stock, data);
        await stock.save();
        return stock;
    }

    async deleteStock(id) {
        const stock = await Stock.findById(id);
        if (!stock) {
            const error = new Error('Stock not found');
            error.statusCode = 404;
            throw error;
        }
        await Stock.findByIdAndDelete(id);
        return { message: 'Stock deleted successfully' };
    }

    async getSectors() {
        const sectors = await Stock.distinct('sector', { isActive: true });
        return sectors;
    }
}

module.exports = new StockService();
