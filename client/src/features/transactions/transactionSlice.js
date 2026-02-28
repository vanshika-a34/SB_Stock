import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../services/axiosInstance';

const initialState = {
    transactions: [],
    totalPages: 1,
    currentPage: 1,
    total: 0,
    isLoading: false,
    isError: false,
    message: '',
    tradeSuccess: false,
    tradeMessage: '',
};

// Buy stock
export const buyStock = createAsyncThunk(
    'transactions/buy',
    async ({ stockId, quantity }, thunkAPI) => {
        try {
            const { data } = await axiosInstance.post('/transactions/buy', {
                stockId,
                quantity,
            });
            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || 'Failed to buy stock'
            );
        }
    }
);

// Sell stock
export const sellStock = createAsyncThunk(
    'transactions/sell',
    async ({ stockId, quantity }, thunkAPI) => {
        try {
            const { data } = await axiosInstance.post('/transactions/sell', {
                stockId,
                quantity,
            });
            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || 'Failed to sell stock'
            );
        }
    }
);

// Get transactions
export const getTransactions = createAsyncThunk(
    'transactions/getAll',
    async (params = {}, thunkAPI) => {
        try {
            const query = new URLSearchParams(params).toString();
            const { data } = await axiosInstance.get(`/transactions?${query}`);
            return data.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || 'Failed to fetch transactions'
            );
        }
    }
);

const transactionSlice = createSlice({
    name: 'transactions',
    initialState,
    reducers: {
        resetTrade: (state) => {
            state.tradeSuccess = false;
            state.tradeMessage = '';
            state.isError = false;
            state.message = '';
        },
    },
    extraReducers: (builder) => {
        builder
            // Buy
            .addCase(buyStock.pending, (state) => {
                state.isLoading = true;
                state.tradeSuccess = false;
            })
            .addCase(buyStock.fulfilled, (state, action) => {
                state.isLoading = false;
                state.tradeSuccess = true;
                state.tradeMessage = action.payload.message;
            })
            .addCase(buyStock.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Sell
            .addCase(sellStock.pending, (state) => {
                state.isLoading = true;
                state.tradeSuccess = false;
            })
            .addCase(sellStock.fulfilled, (state, action) => {
                state.isLoading = false;
                state.tradeSuccess = true;
                state.tradeMessage = action.payload.message;
            })
            .addCase(sellStock.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Get transactions
            .addCase(getTransactions.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getTransactions.fulfilled, (state, action) => {
                state.isLoading = false;
                state.transactions = action.payload.transactions;
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.currentPage;
                state.total = action.payload.total;
            })
            .addCase(getTransactions.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
    },
});

export const { resetTrade } = transactionSlice.actions;
export default transactionSlice.reducer;
