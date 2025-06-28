import { createAsyncThunk } from '@reduxjs/toolkit'
import api from "../../api/api";

export const registerUser = createAsyncThunk(
    'auth/register',
    async ({ username, email, password }, { rejectWithValue }) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
            await api.post(
                `/auth/register`,
                { username, email, password },
                config
            )
        } catch (error) {
            // return custom error message from backend if present
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data);
            } else {
                return rejectWithValue(error.message)
            }
        }
    }
)


export const userLogin = createAsyncThunk(
    'auth/login',
    async ({ username, password }, { rejectWithValue }) => {
        try {
            // configure header's Content-Type as JSON
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
            const { data } = await api.post(
                `/auth/login`,
                { username, password },
                config
            )
            // store user's token in local storage
            localStorage.setItem('userToken', data.token)
            return data
        } catch (error) {
            // return custom error message from API if any
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data);
            } else {
                return rejectWithValue(error.message);
            }
        }
    }
)
