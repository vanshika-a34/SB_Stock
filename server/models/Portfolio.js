const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true,
        },
        holdings: [
            {
                stockId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Stock',
                    required: true,
                },
                symbol: {
                    type: String,
                    required: true,
                },
                companyName: {
                    type: String,
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: [0, 'Quantity cannot be negative'],
                },
                avgBuyPrice: {
                    type: Number,
                    required: true,
                    min: [0, 'Average buy price cannot be negative'],
                },
            },
        ],
        totalInvested: {
            type: Number,
            default: 0,
        },
        totalValue: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Portfolio', portfolioSchema);
