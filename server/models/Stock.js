const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema(
    {
        symbol: {
            type: String,
            required: [true, 'Stock symbol is required'],
            unique: true,
            uppercase: true,
            trim: true,
        },
        companyName: {
            type: String,
            required: [true, 'Company name is required'],
            trim: true,
        },
        price: {
            type: Number,
            required: [true, 'Stock price is required'],
            min: [0, 'Price cannot be negative'],
        },
        previousPrice: {
            type: Number,
            default: 0,
        },
        marketCap: {
            type: Number,
            default: 0,
        },
        sector: {
            type: String,
            required: [true, 'Sector is required'],
            trim: true,
        },
        historicalData: [
            {
                date: { type: Date, default: Date.now },
                price: { type: Number, required: true },
                volume: { type: Number, default: 0 },
            },
        ],
        volume: {
            type: Number,
            default: 0,
        },
        change: {
            type: Number,
            default: 0,
        },
        changePercent: {
            type: Number,
            default: 0,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

// Calculate change before saving
stockSchema.pre('save', function (next) {
    if (this.previousPrice > 0) {
        this.change = this.price - this.previousPrice;
        this.changePercent = ((this.change / this.previousPrice) * 100).toFixed(2);
    }
    next();
});

module.exports = mongoose.model('Stock', stockSchema);
