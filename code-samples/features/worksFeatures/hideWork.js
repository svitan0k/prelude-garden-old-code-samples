import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { getWork } from "./getWork";
import { listWorks } from "./listWorks";



export const changeHiddenState = createAsyncThunk('hideWorkSlice/changeHiddenState', async(args, thunkAPI) => {
    const { workid, userInfo, profileUsername, csrftoken } = args

    try {
        const config = {
            headers: {
                "Content-type": "application/json",
                "X-CSRFToken": csrftoken,
                Authorization: `Bearer ${userInfo.token}`,
            }
        }

        let { data } = await axios.post('api/works/hide-show-work/', {'workid': workid, 'userid': userInfo.id}, config)
        
        
        thunkAPI.dispatch(listWorks({username: profileUsername ? profileUsername : null}))
        thunkAPI.dispatch(getWork({'workid': workid}))
        
        if (Object.keys(data).includes('error')) {
            throw data.error
        }
        return {'workid': workid, 'data': data, }
    } catch (error) {
        return thunkAPI.rejectWithValue(error)
    }
})


export const getHiddenWorks = createAsyncThunk('hideWorkSlice/getHiddenWorks', async(args, thunkAPI) => {
    const { userid, userInfo, csrftoken } = args

    try {
        const config = {
            headers: {
                "Content-type": "application/json",
                "X-CSRFToken": csrftoken,
                Authorization: `Bearer ${userInfo.token}`,
            }
        }

        const { data } = await axios.post(`api/user/getHiddenWorks/`, {'userid': userid}, config)

        if (Object.keys(data).includes('error')) {
            throw data.error
        }

        return data
    } catch (error) {
        return thunkAPI.rejectWithValue(error)
    }
})




export const hideWorkSlice = createSlice({
    name: 'hideWorkSlice',
    initialState: {
        hiddenWorks: [],
        getHiddenWorksError: null,

        
        changeHiddenStateLoading: false,
        changeHiddenStateError: null,
    },
    reducers: {
        insertIntoHiddenWorks: (state, action) => { 
            state.hiddenWorks.unshift(action.payload)
        },
        clearGetHiddenWorksError: (state) => {
            state.getHiddenWorksError = null
        },
        clearChangeHiddenStateError: (state) => {
            state.changeHiddenStateError = null
        },
    },
    extraReducers: {
        
        [getHiddenWorks.fulfilled] : (state, action) => {
            state.hiddenWorks = action.payload['hiddenWorksList']
        },
        [getHiddenWorks.rejected] : (state, action) => {
            state.getHiddenWorksError = action.payload
        },

        
        [changeHiddenState.pending] : (state) => {
            state.changeHiddenStateLoading = true
        },
        [changeHiddenState.fulfilled] : (state, action) => {
            const workid = action.payload['workid']
            const hiddenWorksList = action.payload['data']
            const checkWorkIsHidden = workid in hiddenWorksList
            
            if (checkWorkIsHidden) {
                    state.hiddenWorks = state.hiddenWorks.filter((x) => x !== workid)
            } else {
                    state.hiddenWorks = hiddenWorksList['hiddenWorksList']
            }
            
            state.changeHiddenStateLoading = false
        },
        [changeHiddenState.rejected] : (state, action) => {
            
            state.changeHiddenStateLoading = false
            state.changeHiddenStateError = action.payload
        },
    }
})


export const {
    insertIntoHiddenWorks,
    clearGetHiddenWorksError,
    clearChangeHiddenStateError,
} = hideWorkSlice.actions