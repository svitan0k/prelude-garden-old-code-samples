import axios from "axios"
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";



export const listWorks = createAsyncThunk('listWorkSlice/works', async(args, thunkAPI) => {
    const { userInfo, username, sortWorkType, sortWorkTime, sortingChanged } = args
    let config;

    try {
        let nextPage = thunkAPI.getState().worksList.nextPage
        let scrollState = thunkAPI.getState().worksList.scrollState
        

        if (sortWorkTime === 'newer_works') {
            if (!nextPage || sortingChanged) { 
                if (username) {
                    if (userInfo) { 
                        nextPage = `api/works/getworks/${username}/newer/`
                    } else {
                        nextPage = `api/works/getworks/noinfo/${username}/newer/`
                    }
                } else {
                    nextPage = `api/works/newer/`
                }
                config = {
                    headers: {
                        "Content-type": "application/json",
                    }
                }
            } else {
                if (username) {
                    if (userInfo) {
                        nextPage = `api/works/getworks/${username}/newer/?c=${nextPage}`
                    } else {
                        nextPage = `api/works/getworks/noinfo/${username}/newer/?c=${nextPage}`
                    }
                } else {
                    nextPage = `api/works/newer/?c=${nextPage}`
                }
            }
        } else { 
            if (!nextPage || sortingChanged) { 
                if (username) {
                    if (userInfo) { 
                        nextPage = `api/works/getworks/${username}/older/`
                    } else {
                        nextPage = `api/works/getworks/noinfo/${username}/older/`
                    }
                } else {
                    nextPage = `api/works/older/`
                }
                config = {
                    headers: {
                        "Content-type": "application/json",
                    }
                }
            } else {
                if (username) {
                    if (userInfo) {
                        nextPage = `api/works/getworks/${username}/older/?c=${nextPage}`
                    } else {
                        nextPage = `api/works/getworks/noinfo/${username}/older/?c=${nextPage}`
                    }
                } else {
                    nextPage = `api/works/older/?c=${nextPage}`
                }
            }
        }
        
        let { data } = await axios.get(`${nextPage}`, config)

        if (Object.keys(data).includes('error')) {
            throw data.error
        }
        thunkAPI.dispatch(sortByType({'works': data['works'], 'sortWorkType': sortWorkType, }))


        thunkAPI.dispatch(sortByTime({'works': thunkAPI.getState().worksList.loadedWorks, 'sortByTime': sortWorkTime, sortingChanged }))

        if (data['next_page'] === 'end') {
            thunkAPI.dispatch(endInfScroll())
            return;
        } else {
            return data['next_page'];
        }
    } catch (error) {
        return thunkAPI.rejectWithValue(error)
    }
})


export const listWorkSlice = createSlice({
    name: 'listWorkSlice',
    initialState: {
        works: [],
        loadedWorks: [],
        scrollState: null,
        nextPage: null,
        listWorksLoading: false,
        listWorksError: null,
    },
    reducers: {
        clearScrollState: (state) => {
            state.scrollState = null
            state.nextPage = null
        },
        clearWorksState: (state) => {
            state.works = []
        },
        triggerInfScroll: (state) => {
            state.scrollState = Date.now()
        },
        endInfScroll: (state) => {
            state.scrollState = 'end'
            state.nextPage = null
        },
        clearListWorksError: (state) => {
            state.listWorksError = null
        },
        insertSubmittedWork: (state, action) => {
            if (state.works.length > 0) {
                state.works[0].unshift(action.payload)
            } else { 
                state.works.unshift([action.payload])
            }
        },

        sortByType: (state, action) => {
            const works = action.payload['works']
            const sortby = action.payload['sortWorkType']
            const sorted_works = (sortby) => {
                if (sortby === 'all') {
                    state.loadedWorks = works
                } else {
                    state.loadedWorks = works.filter((x) => x.work_type === sortby)
                    state.listWorksLoading = false
                }
            }
            return sorted_works(sortby)
        },

        sortByTime: (state, action) => {
            function shuffleArray(array) {
                let m = array.length
                let t, i;
                while (m) {
              
                  i = Math.floor(Math.random() * m--);
              
                  t = array[m];
                  array[m] = array[i];
                  array[i] = t;
                }
              
                return array;
            }

            let arrayForSort, sizeOfArray, roundedSize, randomizedArrays;

            const works = action.payload['works']
            const sortingChanged = action.payload['sortingChanged']
            const sortby = action.payload['sortByTime']
            switch(sortby) { 
                default:
                case 'newer_works':
                    arrayForSort = [...works]
                    arrayForSort.sort(function(a,b) {
                        let keyA = new Date(a.publication_date)
                        let keyB = new Date(b.publication_date)
                        if (keyA < keyB) return 1;
                        if (keyA > keyB) return -1;
                        return 0;
                    })
                    
                    sizeOfArray = 5 
                    roundedSize = Math.round(sizeOfArray)                    
                    randomizedArrays = []

                    for (let i=0; i<arrayForSort.length; i+=roundedSize) {
                        randomizedArrays.push(arrayForSort.slice(i, i+roundedSize))
                    }
                    randomizedArrays.forEach((arr) => shuffleArray(arr))

                    if (sortingChanged) {
                        return {
                            ...state,
                            works: [...randomizedArrays],
                        }
                    } else {
                        return {
                            ...state,
                            works: [...state.works, ...randomizedArrays],
                        }
                    }
                    
                case 'older_works':
                    arrayForSort = [...works]
                    arrayForSort.sort(function(a,b) {
                        let keyA = new Date(a.publication_date)
                        let keyB = new Date(b.publication_date)
                        if (keyA > keyB) return 1;
                        if (keyA < keyB) return -1;
                        return 0;
                    })
                    sizeOfArray = 5 
                    roundedSize = Math.round(sizeOfArray)                    
                    randomizedArrays = []

                    for (let i=0; i<arrayForSort.length; i+=roundedSize) {
                        randomizedArrays.push(arrayForSort.slice(i, i+roundedSize))
                    }
                    randomizedArrays.forEach((arr) => shuffleArray(arr))

                    if (sortingChanged) {
                        return {
                            ...state,
                            works: [...randomizedArrays],
                        }
                    } else {
                        return {
                            ...state,
                            works: [...state.works, ...randomizedArrays],
                        }
                    }
                }
        } 
    },
    extraReducers: {
        [listWorks.pending]: (state) => {
            state.listWorksLoading = true
        },

        [listWorks.fulfilled]: (state, action) => {
            state.listWorksLoading = false
            if (action.payload) {
                state.nextPage = action.payload
            }
        },
        [listWorks.rejected]: (state, action) => {
            state.listWorksLoading = false
            state.listWorksError = action.payload
        }
    }
  })

export const {
    sortByType,
    sortByTime,
    insertSubmittedWork,
    endInfScroll,
    triggerInfScroll,
    clearWorksState,
    clearListWorksError,
    clearScrollState,
} = listWorkSlice.actions

