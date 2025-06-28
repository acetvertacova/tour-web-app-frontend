import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";

export const selectBooking = (state) => state.booking.tours;

export const fetchUserBookings = createAsyncThunk('api/bookings',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/bookings');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch bookings');
        }
    }
);

export const bookTour = createAsyncThunk(
    'booking/create',
    async (bookingData, { rejectWithValue }) => {
        try {
            const response = await api.post('/bookings', bookingData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Unathorized');
        }
    }
);

export const cancelBooking = createAsyncThunk(
    'booking/cancel',
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.delete(`/bookings/${id}`);
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || 'Cancel failed');
        }
    }
);