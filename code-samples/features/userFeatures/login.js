import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { clearUserInfo, clearUserSettings, loginUserInfo } from "./userInfo";


export const logoutUser = createAsyncThunk('loginUserSlice/logoutUser', async(args, thunkAPI) => {
    thunkAPI.dispatch(clearUserInfo())
    thunkAPI.dispatch(clearUserSettings())
    localStorage.removeItem('userInfo')
    return;
})

export const loginUser = createAsyncThunk('loginUserSlice/loginUser', async(args, thunkAPI) => {
    const { username, password, csrftoken } = args
    try {
        const config = {
            headers: {
                "Content-type": "application/json",
                "X-CSRFToken": csrftoken,
            }
        }

        const { data } = await axios.post('api/users/login/', {
            'username': username,
            'password': password,
        }, config)

        if (Object.keys(data).includes('error')) {
            throw data.error
        }
        
        localStorage.setItem('userInfo', JSON.stringify(data))
        thunkAPI.dispatch(loginUserInfo(data))

        return;
    } catch (error) {
        return thunkAPI.rejectWithValue(error)
    }
})


export const loginUserSlice = createSlice({
    name: 'loginUserSlice',
    initialState: {
        
        // login
        loginLoading: false,
        loginError: null,


        // logout
        logoutLoading: false,
    },
    reducers: {
        clearLoginError: (state) => {
            state.loginError = null
        }
    },
    extraReducers: {
        //login
        [loginUser.fulfilled]: (state, action) => {
            state.userInfo = action.payload
            state.loginLoading = false
        },
        [loginUser.rejected]: (state, action) => {
            state.loginLoading = false
            state.loginError = action.payload
        },

        // logout
        [logoutUser.pending]: (state) => {
            state.logoutLoading = true
        },
        [logoutUser.fulfilled]: (state, action) => {
            state.userInfo = {}
            state.logoutLoading = false
        },
    },
})


export const {
    clearLoginError,
} = loginUserSlice.actions