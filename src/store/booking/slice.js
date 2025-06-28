import { createSlice } from '@reduxjs/toolkit';
import { bookTour, fetchUserBookings, cancelBooking } from './actions';

const bookingSlice = createSlice({
    name: 'booking',
    initialState: {
        bookings: [],
        loading: false,
        error: null,
        success: false,
    },
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            // Book Tour
            .addCase(bookTour.pending, (state) => {
                state.loading = true;
                state.success = false;
                state.error = null;
            })
            .addCase(bookTour.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.bookings.push(action.payload);
            })
            .addCase(bookTour.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch Bookings
            .addCase(fetchUserBookings.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserBookings.fulfilled, (state, action) => {
                state.loading = false;
                state.bookings = action.payload;
            })
            .addCase(fetchUserBookings.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Cancel Booking
            .addCase(cancelBooking.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(cancelBooking.fulfilled, (state, action) => {
                state.loading = false;
                state.bookings = state.bookings.filter(b => b.id !== action.payload.id);
            })
            .addCase(cancelBooking.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default bookingSlice.reducer;