const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        stockId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Stock',
            required: true,
        },
        symbol: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            enum: ['buy', 'sell'],
            required: [true, 'Transaction type is required'],
        },
        quantity: {
            type: Number,
            required: [true, 'Quantity is required'],
            min: [1, 'Quantity must be at least 1'],
        },
        priceAtExecution: {
            type: Number,
            required: [true, 'Price at execution is required'],
        },
        totalAmount: {
            type: Number,
            required: true,
        },
    },
    { timestamps: true }
);

// Auto-calculate total amount
transactionSchema.pre('validate', function (next) {
    if (this.quantity && this.priceAtExecution) {
        this.totalAmount = this.quantity * this.priceAtExecution;
    }
    next();
});

module.exports = mongoose.model('Transaction', transactionSchema);
