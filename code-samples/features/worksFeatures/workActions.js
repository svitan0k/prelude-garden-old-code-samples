import axios from "axios"
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { insertSubmittedWork } from "./listWorks"
import { getWork } from "./getWork"
import { insertIntoAnonWorks } from "./anonWorks"
import { dispatchSuccessNotification } from "../interfaceFeatures/message"


export const likeWork = createAsyncThunk('workActionsSlice/likeWork', async(args, thunkAPI) => {
    const { userInfo, workid, csrftoken } = args
    
    try {
        const config = {
            headers: {
                "Content-type": "application/json",
                "X-CSRFToken": csrftoken,
                Authorization: `Bearer ${userInfo.token}`,
            }
        }

        const { data } = await axios.post(`api/works/likepost/${workid}/`, {
            'userid': userInfo.id,
        }, config)

        if (Object.keys(data).includes('error')) {
            throw data.error
        }

        return data
    } catch (error) {
        return thunkAPI.rejectWithValue(error)
    }
})


export const submitWork = createAsyncThunk('workActionsSlice/submitWork', async(args, thunkAPI) => {
    const { userInfo, title, editorState, dateWritten, workType, anonPublish, captchaToken, csrftoken } = args
    try {
        const config = {
            headers: {
                "Content-type": "application/json",
                "X-CSRFToken": csrftoken,
                Authorization: `Bearer ${userInfo.token}`,
            }
        }

        const { data } = await axios.post('api/works/add/', {
            'user': userInfo.id,
            'title': title,
            'body': editorState.getCurrentContent().getPlainText(),
            'written_date': dateWritten,
            'work_type': workType,
            'published_anonymously': anonPublish,
        }, config)

        if (Object.keys(data).includes('error')) {
            throw data.error
        }
        
        thunkAPI.dispatch(insertSubmittedWork(data))
        if (data.published_anonymously) {
            thunkAPI.dispatch(insertIntoAnonWorks(data.id))
        }
        return;
    } catch (error) {
        return thunkAPI.rejectWithValue(error)
    }
})


export const updateWork = createAsyncThunk('workActionsSlice/updateWork', async(args, thunkAPI) => {
    const { workid, title, formBody, dateWritten, workType, anonPublish, userInfo, csrftoken } = args
    try {
        const config = {
            headers: {
                "Content-type": "application/json",
                "X-CSRFToken": csrftoken,
                Authorization: `Bearer ${userInfo.token}`,
            }
        }

        const { data } = await axios.put('api/works/update/', {
            'workid': workid,
            'title': title,
            'body': formBody.getCurrentContent().getPlainText(),
            'dateWritten': dateWritten,
            'workType': workType,
            'anonPublish': anonPublish,
        }, config)

        if (Object.keys(data).includes('error')) {
            throw data.error
        }

        thunkAPI.dispatch(dispatchSuccessNotification('Saved'))
        return;
    } catch (error) {
        return thunkAPI.rejectWithValue(error)
    }
})


export const getWorkAttributes = createAsyncThunk('workActionsSlice/getWorkAttributes', async(args, thunkAPI) => {
    try {
        const config = {
            headers: {
                "Content-type": "application/json",
            }
        }
        const { data } = await axios.get('api/user/getWorkAttributes/', config)

        if (Object.keys(data).includes('error')) {
            throw data.error
        }

        return data

    } catch (error) {
        return thunkAPI.rejectWithValue(error)
    }
})


export const getUserLikes = createAsyncThunk('workActionsSlice/getUserLikes', async(args, thunkAPI) => {
    const { userInfo, csrftoken } = args
    try {
        const config = {
            headers: {
                "Content-type": "application/json",
                "X-CSRFToken": csrftoken,
                Authorization: `Bearer ${userInfo.token}`,
            }
        }

        const { data } = await axios.post('api/user/getlikes/', {'user': userInfo.id}, config)
        
        if (Object.keys(data).includes('error')) {
            throw data.error
        }

        return data
    } catch (error) {
        return thunkAPI.rejectWithValue(error)
    }
})




export const workActionsSlice = createSlice({
    name: 'workActionsSlice',
    initialState: {
        likeWorkLoading: false,
        userLikes: [],
        likesOnPosts: {},
        likeWorkError: null,

        submitWorkLoading: false,
        submitWorkError: null,
        submitWorkSuccess: null,

        updateWorkLoading: false,
        updateWorkError: null,

        getWorkAttributesLoading: false,
        getWorkAttributesError: null,

        getUserLikesLoading: false,
        getUserLikesError: null,

    },
    reducers: {
        clearLikeWorkError: (state) => {
            state.likeWorkError = null
        },
        clearSubmitWorkError: (state) => {
            state.submitWorkError = null
        },
        clearUpdateWorkError: (state) => {
            state.updateWorkError = null
        },
        clearGetWorkAttributesError: (state) => {
            state.getWorkAttributesError = null
        },
        clearGetUserLikesError: (state) => {
            state.getUserLikesError = null
        },
        clearSubmitWorkSuccess: (state) => {
            state.submitWorkSuccess = null
        }
    }, 
    extraReducers: {

        [likeWork.pending] : (state) => {
            state.likeWorkLoading = true
        },
        [likeWork.fulfilled] : (state, action) => {
            const _ = action.payload
            const likeOnPostExists = state.userLikes.find((x) => x === _['liked_post'])
            if (likeOnPostExists) {
                state.userLikes = state.userLikes.filter((x) => x !== _['liked_post'])
                state.likesOnPosts[_['liked_post']] = state.likesOnPosts[_['liked_post']] - 1 
            } else {
                state.userLikes.push(_['liked_post']) 
                state.likesOnPosts[_['liked_post']] = _['like_count']
            }
            state.likeWorkLoading = false
        },
        [likeWork.rejected] : (state, action) => {
            state.likeWorkLoading = false
            state.likeWorkError = action.payload
        },

        [submitWork.pending] : (state) => {
            state.submitWorkLoading = true
        },
        [submitWork.fulfilled] : (state) => {
            state.submitWorkLoading = false
            state.submitWorkSuccess = 'Work published!'
        },
        [submitWork.rejected] : (state, action) => {
            state.submitWorkLoading = false
            state.submitWorkError = action.payload
        },

        [updateWork.pending] : (state) => {
            state.updateWorkLoading = true
        },
        [updateWork.fulfilled] : (state) => {
            state.updateWorkLoading = false
        },
        [updateWork.rejected] : (state, action) => {
            state.updateWorkLoading = false
            state.updateWorkError = action.payload
        },

        [getWorkAttributes.pending] : (state) => {
            state.getWorkAttributesLoading = true
        },
        [getWorkAttributes.fulfilled] : (state, action) => {
            state.userLikes = []
            state.likesOnPosts = action.payload['liked_works']
            state.getWorkAttributesLoading = false
        },
        [getWorkAttributes.rejected] : (state, action) => {
            state.getWorkAttributesLoading = false
            state.getWorkAttributesError = action.payload
        },

        [getUserLikes.pending] : (state) => {
            state.getUserLikesLoading = true
        },
        [getUserLikes.fulfilled] : (state, action) => {
            state.userLikes = action.payload['liked_posts']
            state.likesOnPosts = action.payload['liked_works']
            state.getUserLikesLoading = false
        },
        [getUserLikes.rejected] : (state, action) => {
            state.getUserLikesLoading = false
            state.getUserLikesError = action.payload
        },

    }
    
})


export const {
    clearLikeWorkError,
    clearSubmitWorkError,
    clearUpdateWorkError,
    clearGetWorkAttributesError,
    clearGetUserLikesError,
    clearSubmitWorkSuccess,
} = workActionsSlice.actions