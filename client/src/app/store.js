import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import stockReducer from '../features/stocks/stockSlice';
import portfolioReducer from '../features/portfolio/portfolioSlice';
import transactionReducer from '../features/transactions/transactionSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        stocks: stockReducer,
        portfolio: portfolioReducer,
        transactions: transactionReducer,
    },
    devTools: import.meta.env.DEV,
});

export default store;
