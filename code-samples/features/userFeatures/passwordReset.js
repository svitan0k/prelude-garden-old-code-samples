import axios from "axios"
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"


export const passwordReset = createAsyncThunk('passwordResetProcessSlice/passwordReset', async(args, thunkAPI) => {
    let config;
    const { step, username, secQuestionId, answer } = args

    switch(step) {
        case 'getQuestion':

            try {
                config = {
                    headers: {
                        "Content-type": 'application/json',
                    }
                }
                var { data } = await axios.get(`api/passwordreset/getusersecretquestion${secQuestionId}/${username}/`, config)
                
                if (Object.keys(data).includes('error')) {
                    throw data.error
                }

                thunkAPI.dispatch(gotQuestions({'data': data['secret_question'], 'qID': secQuestionId,}))        
                return;
            } catch (error) {
                return thunkAPI.rejectWithValue(error)
            }
        case 'checkQuestion1':
            try {
                config = {
                    headers: {
                        "Content-type": 'application/json',
                    }
                }

                var { data } = await axios.get(`api/passwordreset/checkanswer${secQuestionId}/${username}/${answer}/`, config)

                if (Object.keys(data).includes('error')) {
                    throw data.error
                }

                thunkAPI.dispatch(setAnswerStatus1(data))
                return;
            } catch (error) {
                return thunkAPI.rejectWithValue(error)
            }
        case 'checkQuestion2':
            try {
                config = {
                    headers: {
                        "Content-type": 'application/json',
                    }
                }

                var {data} = await axios.get(`api/passwordreset/checkanswer${secQuestionId}/${username}/${answer}/`, config)
                
                if (Object.keys(data).includes('error')) {
                    throw data.error
                }

                thunkAPI.dispatch(setAnswerStatus2({'ans_status': data['status'], 'token': data['token'],}))

                return;
            } catch (error) {
                thunkAPI.rejectWithValue(error)
            }
        default:
            return;
        }
})

export const passwordResetProcessSlice = createSlice({
    name: 'passwordResetProcessSlice',
    initialState: {
        gotQuestion: [],
        answerStatus1: null,
        answerStatus2: null,
        token: null,
        passwordResetError: null,
        passwordResetLoading: false,
    },
    reducers: {
        clearPasswordResetProcess: (state, action) => {
            state.gotQuestion = []
            state.answerStatus1 = null
            state.answerStatus2 = null
            state.token = null
            state.passwordResetError = ''
        },
        clearPasswordResetError: (state) => {
            state.passwordResetError = null
        },
        setPasswordResetLoading: (state, action) => {
            state.passwordResetLoading = action.payload
        },
        gotQuestions: (state, action) => {
            state.gotQuestion.push({[action.payload['qID']]: action.payload['data']})
        },
        setAnswerStatus1: (state, action) => {
            state.answerStatus1 = action.payload
        },
        setAnswerStatus2: (state, action) => {
            state.answerStatus2 = action.payload['ans_status']
            state.token = action.payload['token']
        },
        clearAnswerStatus1: (state) => {
            state.answerStatus1 = null
        },
        clearAnswerStatus2: (state) => {
            state.answerStatus2 = null
        },
    },
    extraReducers: {
        [passwordReset.rejected]: (state, action) => {
            state.passwordResetError = action.payload
        },
    }
})


export const {
    gotQuestions,
    setAnswerStatus1,
    setAnswerStatus2,
    setPasswordResetLoading,
    clearPasswordResetProcess,
    clearPasswordResetError,
    clearAnswerStatus1,
    clearAnswerStatus2,
} = passwordResetProcessSlice.actions