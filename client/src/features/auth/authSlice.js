import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authAPI } from './authAPI';

// Get user from localStorage
const user = JSON.parse(localStorage.getItem('user'));

const initialState = {
    user: user || null,
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: '',
};

// Register user
export const register = createAsyncThunk(
    'auth/register',
    async (userData, thunkAPI) => {
        try {
            const data = await authAPI.register(userData);
            if (data.success) {
                localStorage.setItem('user', JSON.stringify(data.data));
                if (data.token) localStorage.setItem('token', data.token);
            }
            return data;
        } catch (error) {
            const message =
                error.response?.data?.message || error.message || 'Registration failed';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Login user
export const login = createAsyncThunk(
    'auth/login',
    async (credentials, thunkAPI) => {
        try {
            const data = await authAPI.login(credentials);
            if (data.success) {
                localStorage.setItem('user', JSON.stringify(data.data));
                if (data.token) localStorage.setItem('token', data.token);
            }
            return data;
        } catch (error) {
            const message =
                error.response?.data?.message || error.message || 'Login failed';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Logout
export const logout = createAsyncThunk('auth/logout', async () => {
    await authAPI.logout();
    localStorage.removeItem('user');
    localStorage.removeItem('token');
});

// Get current user
export const getMe = createAsyncThunk('auth/getMe', async (_, thunkAPI) => {
    try {
        const data = await authAPI.getMe();
        if (data.success) {
            localStorage.setItem('user', JSON.stringify(data.data));
        }
        return data;
    } catch (error) {
        const message =
            error.response?.data?.message || error.message || 'Failed to get user';
        return thunkAPI.rejectWithValue(message);
    }
});

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.isError = false;
            state.isSuccess = false;
            state.message = '';
        },
    },
    extraReducers: (builder) => {
        builder
            // Register
            .addCase(register.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.user = action.payload.data;
            })
            .addCase(register.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                state.user = null;
            })
            // Login
            .addCase(login.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.user = action.payload.data;
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                state.user = null;
            })
            // Logout
            .addCase(logout.fulfilled, (state) => {
                state.user = null;
            })
            // Get Me
            .addCase(getMe.fulfilled, (state, action) => {
                state.user = action.payload.data;
            })
            .addCase(getMe.rejected, (state) => {
                state.user = null;
                localStorage.removeItem('user');
                localStorage.removeItem('token');
            });
    },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;
