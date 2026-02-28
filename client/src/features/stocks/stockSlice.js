import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../services/axiosInstance';

const initialState = {
    stocks: [],
    currentStock: null,
    sectors: [],
    totalPages: 1,
    currentPage: 1,
    total: 0,
    isLoading: false,
    isError: false,
    message: '',
};

// Get all stocks
export const getStocks = createAsyncThunk(
    'stocks/getAll',
    async (params = {}, thunkAPI) => {
        try {
            const query = new URLSearchParams(params).toString();
            const { data } = await axiosInstance.get(`/stocks?${query}`);
            return data.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || 'Failed to fetch stocks'
            );
        }
    }
);

// Get single stock
export const getStockById = createAsyncThunk(
    'stocks/getById',
    async (id, thunkAPI) => {
        try {
            const { data } = await axiosInstance.get(`/stocks/${id}`);
            return data.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || 'Failed to fetch stock'
            );
        }
    }
);

// Get sectors
export const getSectors = createAsyncThunk(
    'stocks/getSectors',
    async (_, thunkAPI) => {
        try {
            const { data } = await axiosInstance.get('/stocks/sectors');
            return data.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || 'Failed to fetch sectors'
            );
        }
    }
);

const stockSlice = createSlice({
    name: 'stocks',
    initialState,
    reducers: {
        clearCurrentStock: (state) => {
            state.currentStock = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getStocks.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getStocks.fulfilled, (state, action) => {
                state.isLoading = false;
                state.stocks = action.payload.stocks;
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.currentPage;
                state.total = action.payload.total;
            })
            .addCase(getStocks.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(getStockById.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getStockById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.currentStock = action.payload;
            })
            .addCase(getStockById.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(getSectors.fulfilled, (state, action) => {
                state.sectors = action.payload;
            });
    },
});

export const { clearCurrentStock } = stockSlice.actions;
export default stockSlice.reducer;
