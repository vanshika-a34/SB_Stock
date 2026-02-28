const dotenv = require('dotenv');
dotenv.config();

const mongoose = require('mongoose');
const Stock = require('./models/Stock');
const User = require('./models/User');

const stocks = [
    { symbol: 'AAPL', companyName: 'Apple Inc.', price: 178.72, marketCap: 2800000000000, sector: 'Technology', volume: 54230000 },
    { symbol: 'MSFT', companyName: 'Microsoft Corporation', price: 378.91, marketCap: 2810000000000, sector: 'Technology', volume: 22340000 },
    { symbol: 'GOOGL', companyName: 'Alphabet Inc.', price: 141.80, marketCap: 1770000000000, sector: 'Technology', volume: 23450000 },
    { symbol: 'AMZN', companyName: 'Amazon.com Inc.', price: 178.25, marketCap: 1860000000000, sector: 'Consumer Cyclical', volume: 45670000 },
    { symbol: 'NVDA', companyName: 'NVIDIA Corporation', price: 721.33, marketCap: 1780000000000, sector: 'Technology', volume: 41230000 },
    { symbol: 'META', companyName: 'Meta Platforms Inc.', price: 484.03, marketCap: 1240000000000, sector: 'Technology', volume: 14560000 },
    { symbol: 'TSLA', companyName: 'Tesla Inc.', price: 188.71, marketCap: 601000000000, sector: 'Consumer Cyclical', volume: 98760000 },
    { symbol: 'BRK.B', companyName: 'Berkshire Hathaway', price: 407.19, marketCap: 878000000000, sector: 'Financial Services', volume: 3450000 },
    { symbol: 'JPM', companyName: 'JPMorgan Chase & Co.', price: 196.47, marketCap: 566000000000, sector: 'Financial Services', volume: 8900000 },
    { symbol: 'V', companyName: 'Visa Inc.', price: 281.52, marketCap: 577000000000, sector: 'Financial Services', volume: 6780000 },
    { symbol: 'JNJ', companyName: 'Johnson & Johnson', price: 156.74, marketCap: 378000000000, sector: 'Healthcare', volume: 7890000 },
    { symbol: 'UNH', companyName: 'UnitedHealth Group', price: 527.40, marketCap: 487000000000, sector: 'Healthcare', volume: 3210000 },
    { symbol: 'PG', companyName: 'Procter & Gamble Co.', price: 160.99, marketCap: 379000000000, sector: 'Consumer Defensive', volume: 6540000 },
    { symbol: 'MA', companyName: 'Mastercard Inc.', price: 457.12, marketCap: 428000000000, sector: 'Financial Services', volume: 3210000 },
    { symbol: 'HD', companyName: 'The Home Depot Inc.', price: 381.94, marketCap: 378000000000, sector: 'Consumer Cyclical', volume: 3450000 },
    { symbol: 'XOM', companyName: 'Exxon Mobil Corporation', price: 104.76, marketCap: 430000000000, sector: 'Energy', volume: 15670000 },
    { symbol: 'DIS', companyName: 'The Walt Disney Company', price: 111.25, marketCap: 203000000000, sector: 'Communication Services', volume: 9870000 },
    { symbol: 'NFLX', companyName: 'Netflix Inc.', price: 605.88, marketCap: 263000000000, sector: 'Communication Services', volume: 5430000 },
    { symbol: 'KO', companyName: 'The Coca-Cola Company', price: 60.22, marketCap: 260000000000, sector: 'Consumer Defensive', volume: 12340000 },
    { symbol: 'PFE', companyName: 'Pfizer Inc.', price: 27.43, marketCap: 154000000000, sector: 'Healthcare', volume: 34560000 },
];

const generateHistoricalData = (basePrice) => {
    const data = [];
    const now = new Date();
    for (let i = 30; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const variance = (Math.random() - 0.5) * 0.06;
        const price = Number((basePrice * (1 + variance)).toFixed(2));
        data.push({
            date,
            price,
            volume: Math.floor(Math.random() * 50000000) + 1000000,
        });
    }
    return data;
};

const runSeed = async () => {
    try {
        const stockCount = await Stock.countDocuments();
        if (stockCount > 0) {
            console.log('Database already contains stocks. Skipping automatic seed.');
            return;
        }

        console.log('Seeding initial data...');
        await Stock.deleteMany({});

        const stocksWithHistory = stocks.map((stock) => ({
            ...stock,
            previousPrice: Number((stock.price * (1 + (Math.random() - 0.5) * 0.04)).toFixed(2)),
            historicalData: generateHistoricalData(stock.price),
            change: Number(((Math.random() - 0.4) * 8).toFixed(2)),
            changePercent: Number(((Math.random() - 0.4) * 4).toFixed(2)),
        }));

        await Stock.insertMany(stocksWithHistory);
        console.log(`Seeded ${stocksWithHistory.length} stocks successfully!`);

        const existingAdmin = await User.findOne({ email: 'admin@sbstocks.com' });
        if (!existingAdmin) {
            await User.create({
                name: 'Admin',
                email: 'admin@sbstocks.com',
                password: 'admin123',
                role: 'admin',
                virtualBalance: 1000000,
            });
            console.log('Admin user created (email: admin@sbstocks.com, password: admin123)');
        }

        console.log('Seeding complete!');
    } catch (error) {
        console.error('Seeding error:', error);
        throw error;
    }
};

const { MongoMemoryServer } = require('mongodb-memory-server');

const seedDBStandalone = async () => {
    try {
        let conn;
        try {
            conn = await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 2000 });
            console.log('MongoDB Connected for seeding...', conn.connection.host);
        } catch (error) {
            if (error.message.includes('ECONNREFUSED')) {
                console.log('Local MongoDB not found. Starting in-memory MongoDB server for seeding...');
                const mongoServer = await MongoMemoryServer.create();
                const mongoUri = mongoServer.getUri();
                conn = await mongoose.connect(mongoUri);
                console.log('In-Memory MongoDB Connected for seeding...', conn.connection.host);

                process.on('exit', () => mongoServer.stop());
            } else {
                throw error;
            }
        }

        await runSeed();
        process.exit(0);
    } catch (error) {
        console.error('Standalone seeding error:', error);
        process.exit(1);
    }
};

if (require.main === module) {
    seedDBStandalone();
}

module.exports = { runSeed };
