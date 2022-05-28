import axios from "axios"
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"

axios.defaults.baseURL = '/'

export const getProfile = createAsyncThunk('profileViewSlice/getProfile', async(args, thunkAPI) => {
    const { profileUsername } = args
    try {
        const config = {
            headers: {
                "Content-type": "application/json",
            }
        }

        const { data } = await axios.get(`api/user/userprofile/${profileUsername}/`, config)

        if (Object.keys(data).includes('error')) {
            throw data.error
        }

        return data
    } catch (error) {
        return thunkAPI.rejectWithValue(error)
    }
}) 


export const profileViewSlice = createSlice({
    name: 'profileViewSlice',
    initialState: {
        profileInfo: [],
        getProfileLoading: false,
        getProfileError: null,
    },
    reducers: {
        clearProfileView: (state) => {
            state.profileInfo = []
        },
        updateProfileInfo: (state, action) => {
            state.profileInfo = action.payload
        },
        clearProfileError: (state) => {
            state.getProfileError = null
        }
    },
    extraReducers: {
        [getProfile.pending]: (state) => {
            state.getProfileLoading = true
        },
        [getProfile.fulfilled]: (state, action) => {
            state.profileInfo = action.payload
            state.getProfileLoading = false
        },
        [getProfile.rejected]: (state, action) => {
            state.getProfileLoading = false
            state.getProfileError = action.payload
        },
    }
})

export const {
    clearProfileView,
    updateProfileInfo,
    clearProfileError,
} = profileViewSlice.actions