import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../services/axiosInstance';

const initialState = {
    holdings: [],
    totalInvested: 0,
    totalCurrentValue: 0,
    totalProfitLoss: 0,
    availableBalance: 0,
    isLoading: false,
    isError: false,
    message: '',
};

// Get portfolio
export const getPortfolio = createAsyncThunk(
    'portfolio/get',
    async (_, thunkAPI) => {
        try {
            const { data } = await axiosInstance.get('/portfolio');
            return data.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || 'Failed to fetch portfolio'
            );
        }
    }
);

const portfolioSlice = createSlice({
    name: 'portfolio',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getPortfolio.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getPortfolio.fulfilled, (state, action) => {
                state.isLoading = false;
                state.holdings = action.payload.holdings;
                state.totalInvested = action.payload.totalInvested;
                state.totalCurrentValue = action.payload.totalCurrentValue;
                state.totalProfitLoss = action.payload.totalProfitLoss;
                state.availableBalance = action.payload.availableBalance;
            })
            .addCase(getPortfolio.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
    },
});

export default portfolioSlice.reducer;
