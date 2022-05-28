import axios from "axios"
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { updateProfileInfo } from "./profileView"


export const updateUserProfileSettings = createAsyncThunk('userInfoSlice/updateUserProfileSettings', async(args, thunkAPI) => {
    const {userInfo, firstNameSeetings, lastNameSeetings, emailSettings, telegramLinkSettings, showEmail, showTelegramLink, showName, csrftoken} = args

    try {
        const config = {
            headers: {
                "Content-type": "application/json",
                "X-CSRFToken": csrftoken,
                Authorization: `Bearer ${userInfo.token}`,
            }
        }

        const { data } = await axios.post('api/users/updateProfileSettings/', {
            'id': userInfo.id,
            'first_name': firstNameSeetings,
            'last_name': lastNameSeetings,
            'email': emailSettings,
            'telegram_link': telegramLinkSettings,
            'showEmail': showEmail,
            'showName': showName,
            'showTelegramLink': showTelegramLink,
        }, config)

        if (Object.keys(data).includes('error')) {
            throw data.error
        }
        thunkAPI.dispatch(updateProfileInfo(data['profile_info']))
        localStorage.setItem('userInfo', JSON.stringify(data['user_info']))

        return {'user_info': data['user_info'], 'user_prefs': data['user_prefs'], 'user_settings': data['user_settings']}

    } catch (error) {
        return thunkAPI.rejectWithValue(error)
    }
})

export const updateWithSwitchToEdit = createAsyncThunk('userInfoSlice/updateUserProfileInfo', async(args, thunkAPI) => { 
    const { userInfo, editProfileUsername, editProfileFirstName, editProfileLastName, editProfileEmail, editProfileTelegramLink, showEmail, showTelegramLink, csrftoken } = args
    

    try {
        const config = {
            headers: {
                "Content-type": "application/json",
                "X-CSRFToken": csrftoken,
                Authorization: `Bearer ${userInfo.token}`,
            }
        }

        const profile_info_state = thunkAPI.getState().profileInfo.profileInfo

        const { data } = await axios.post('api/users/updateProfileInfoWithSwitchToEdit/', {
            
            'id': userInfo.id,
            'first_name': editProfileFirstName !== '' ? editProfileFirstName : '', 
            'last_name': editProfileLastName !== '' ? editProfileLastName : '',
            'email': editProfileEmail !== '' ? editProfileEmail : showEmail ? '' : userInfo.email,
            'username': editProfileUsername !== '' ? editProfileUsername : '',
            'telegram_link': editProfileTelegramLink !== '' ? editProfileTelegramLink : showTelegramLink ? '' : userInfo.telegram_link,
        }, config)
        
        if (Object.keys(data).includes('error')) {
            throw data.error
        }

        thunkAPI.dispatch(updateProfileInfo(data['profile_info']))
        localStorage.setItem('userInfo', JSON.stringify(data['user_info']))
        return {'user_info': data['user_info'], 'user_settings': data['user_settings']}
        
    } catch (error) {
        return thunkAPI.rejectWithValue(error)
    }
})

export const getUserSettings = createAsyncThunk('userInfoSlice/getUserSettings', async(args, thunkAPI) => {
    const { userInfo } = args

    try {
        const config = {
            headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${userInfo.token}`,
            }
        }

        
        const { data } = await axios.get(`api/users/getusersettings/${userInfo.id}/`, config)
       
        if (Object.keys(data).includes('error')) {
            throw data.error
        }
        
        return data
    } catch (error) {
        return thunkAPI.rejectWithValue(error)
    }
})


export const userInfoSlice = createSlice({
    name: 'userInfoSlice',
    initialState: {
        userInfo: null,

        updateProfileInfoLoading: false,
        updateProfileInfoError: null,
        userSettingsUpdateSuccess: null,
        
        userSettings: {},
        userSettingsError: null,


    },
    reducers: {
        loginUserInfo: (state, action) => {
            state.userInfo = action.payload
        },
        clearUserInfo: (state) => {
            state.userInfo = null
        },
        clearUserSettings: (state) => {
            state.userSettings = {}
        },
        clearUpdateProfileInfoError: (state) => {
            state.updateProfileInfoError = null
        },
        clearuserSettingsError: (state) => {
            state.userSettingsError = null
        },
        clearUserSettingsUpdateSuccess: (state) => {
            state.userSettingsUpdateSuccess = null
        },
    },
    extraReducers: {
        
        [updateUserProfileSettings.pending]: (state) => {
            state.updateProfileInfoLoading = true
        },
        [updateUserProfileSettings.fulfilled]: (state, action) => {
            state.userInfo = action.payload['user_info']
            state.userSettings = {'user_prefs': action.payload['user_prefs'], 'user_settings': action.payload['user_settings']}
            state.updateProfileInfoLoading = false
            state.userSettingsUpdateSuccess = 'Saved'
        },
        [updateUserProfileSettings.rejected]: (state, action) => {
            state.updateProfileInfoLoading = false
            state.updateProfileInfoError = action.payload
        },


        
        [updateWithSwitchToEdit.pending]: (state) => {
            state.updateProfileInfoLoading = true
        },
        [updateWithSwitchToEdit.fulfilled]: (state, action) => {
            state.userInfo = action.payload['user_info']
            state.userSettings['user_settings'] = action.payload['user_settings']
            state.updateProfileInfoLoading = false
            state.userSettingsUpdateSuccess = 'Saved'
        },
        [updateWithSwitchToEdit.rejected]: (state, action) => {
            state.updateProfileInfoLoading = false
            state.updateProfileInfoError = action.payload
        },

        
        [getUserSettings.fulfilled]: (state, action) => {
            state.userSettings = action.payload
        },
        [getUserSettings.rejected]: (state, action) => {
            state.userSettingsError = action.payload
        },
    }
})

export const {
    loginUserInfo,
    clearUserInfo,
    clearUserSettings,
    clearUpdateProfileInfoError,
    clearuserSettingsError,
    clearUserSettingsUpdateSuccess,
} = userInfoSlice.actions