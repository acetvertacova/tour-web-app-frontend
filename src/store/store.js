import { configureStore } from '@reduxjs/toolkit';
import bookingReducer from './booking/slice';
import authReducer from './auth/slice';

const store = configureStore({
    reducer: {
        booking: bookingReducer,
        auth: authReducer,
    },
});

export default store;