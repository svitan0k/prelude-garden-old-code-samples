import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { loginUserInfo } from "./userInfo";



export const registerUser = createAsyncThunk('registerUserSlice/registerUser', async(args, thunkAPI) => {
    const { email, username, password, firstName, lastName, secretQuestion1, secretAnswer1, secretQuestion2, secretAnswer2, csrftoken } = args
    try {
        const config = {
            headers: {
                'Content-type': 'application/json',
                "X-CSRFToken": csrftoken,
            }
        }

        const { data } = await axios.post('api/users/register/', {
            'username': username,
            'password': password,
            'firstName': firstName ? firstName : '',
            'lastName': lastName ? lastName: '',
            'email': email ? email : '',
            'secretQuestion1': secretQuestion1,
            'secretAnswer1': secretAnswer1.toLowerCase(),
            'secretQuestion2': secretQuestion2,
            'secretAnswer2': secretAnswer2.toLowerCase(),
        }, config)

        if (Object.keys(data).includes('error')) {
            throw data.error
        }

        thunkAPI.dispatch(loginUserInfo(data))

        localStorage.setItem('userInfo', JSON.stringify(data))

        return data 
    } catch (error) {
        return thunkAPI.rejectWithValue(error)
    }
})

export const registerUserSlice = createSlice({
    name: 'registerUserSlice',
    initialState: {
        registerLoading: false,
        registerError: null,
    },
    reducers: {
        clearRegisterError: (state) => {
            state.registerError = null
        },
    },
    extraReducers: {
        [registerUser.pending]: (state) => {
            state.registerLoading = true
        },
        [registerUser.fulfilled]: (state, action) => {
            state.registerLoading = false
        },
        [registerUser.rejected]: (state, action) => {
            state.registerLoading = false
            state.registerError = action.payload
        },
    },
})


export const {
    clearRegisterError,
} = registerUserSlice.actions