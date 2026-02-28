const { body } = require('express-validator');

const registerValidation = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ max: 50 })
        .withMessage('Name cannot exceed 50 characters'),
    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Please provide a valid email'),
    body('password')
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters'),
];

const loginValidation = [
    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Please provide a valid email'),
    body('password').notEmpty().withMessage('Password is required'),
];

const tradeValidation = [
    body('stockId').notEmpty().withMessage('Stock ID is required'),
    body('quantity')
        .notEmpty()
        .withMessage('Quantity is required')
        .isInt({ min: 1 })
        .withMessage('Quantity must be at least 1'),
];

const stockValidation = [
    body('symbol')
        .trim()
        .notEmpty()
        .withMessage('Stock symbol is required')
        .isLength({ max: 10 })
        .withMessage('Symbol cannot exceed 10 characters'),
    body('companyName')
        .trim()
        .notEmpty()
        .withMessage('Company name is required'),
    body('price')
        .notEmpty()
        .withMessage('Price is required')
        .isFloat({ min: 0.01 })
        .withMessage('Price must be greater than 0'),
    body('sector').trim().notEmpty().withMessage('Sector is required'),
];

module.exports = {
    registerValidation,
    loginValidation,
    tradeValidation,
    stockValidation,
};
