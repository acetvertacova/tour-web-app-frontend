import { createSlice } from '@reduxjs/toolkit'
import { registerUser, userLogin } from './actions'
import { jwtDecode } from 'jwt-decode';

const userToken = localStorage.getItem('userToken')
    ? localStorage.getItem('userToken')
    : null

let userInfo = {};
if (userToken) {
    try {
        userInfo = jwtDecode(userToken);
    } catch (error) {
        console.error('Invalid token', error);
        //if token is invalid - delete
        localStorage.removeItem('userToken');
    }
}

const initialState = {
    loading: false,
    userInfo,
    userToken,
    error: null,
    success: false,
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.userInfo = {};
            state.userToken = null;
            state.error = null;
            localStorage.removeItem('userToken');
        }
    },
    extraReducers: (builder) => {
        // Register
        builder
            .addCase(registerUser.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(registerUser.fulfilled, (state, { payload }) => {
                state.loading = false
                state.success = true
            })
            .addCase(registerUser.rejected, (state, { payload }) => {
                state.loading = false
                state.error = payload
            })

            // Login
            .addCase(userLogin.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(userLogin.fulfilled, (state, { payload }) => {
                state.loading = false
                state.userInfo = jwtDecode(payload.token)
                state.userToken = payload.token
            })
            .addCase(userLogin.rejected, (state, { payload }) => {
                state.loading = false
                state.error = payload
            })
    },
})

export const { logout } = authSlice.actions;
export default authSlice.reducer
