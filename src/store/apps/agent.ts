// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'
import authConfig from 'src/configs/auth'

interface DataParams1 {
    pageId: number
    pageSize: number
}

interface DataParams2 {
  pageId: number
  pageSize: number
  address: string
}

// ** Fetch Data
export const fetchAllAgentData = createAsyncThunk('appAgent/fetchAllAgentData', async (params: DataParams1) => {  
  const response = await axios.get(authConfig.backEndApi + '/address/agent/'+ `${params.pageId}` + '/'+params.pageSize)

  return response.data
})

export const fetchAgentMembersData = createAsyncThunk('appAgent/fetchAgentMembersData', async (params: DataParams2) => {  
  const response = await axios.get(authConfig.backEndApi + '/address/referee/'+ `${params.address}` + '/'+ `${params.pageId}` + '/'+params.pageSize)

  return response.data
})

export const fetchAgentRewardData = createAsyncThunk('appAgent/fetchAgentRewardData', async (params: DataParams2) => {  
  const response = await axios.get(authConfig.backEndApi + '/address/reward/'+ `${params.address}` + '/'+ `${params.pageId}` + '/'+params.pageSize)

  return response.data
})

export const fetchAgentProjectData = createAsyncThunk('appAgent/fetchAgentProjectData', async (params: DataParams2) => {  
  const response = await axios.get(authConfig.backEndApi + '/address/project/'+ `${params.address}` + '/'+ `${params.pageId}` + '/'+params.pageSize)

  return response.data
})

export const fetchAgentSubscribeData = createAsyncThunk('appAgent/fetchAgentSubscribeData', async (params: DataParams2) => {  
  const response = await axios.get(authConfig.backEndApi + '/address/subscribe/'+ `${params.address}` + '/'+ `${params.pageId}` + '/'+params.pageSize)

  return response.data
})

export const appAgentSlice = createSlice({
  name: 'appAgent',
  initialState: {
    data: [],
    total: 1,
    params: {},
    allData: [],
    allPages: 1,
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchAllAgentData.fulfilled, (state, action) => {
      state.data = action.payload.data
      state.total = action.payload.total
      state.params = action.payload.params
      state.allData = action.payload.data
      state.allPages = action.payload.allpages
    }),
    builder.addCase(fetchAgentMembersData.fulfilled, (state, action) => {
      state.data = action.payload.data
      state.total = action.payload.total
      state.params = action.payload.params
      state.allData = action.payload.data
      state.allPages = action.payload.allpages
    }),
    builder.addCase(fetchAgentRewardData.fulfilled, (state, action) => {
      state.data = action.payload.data
      state.total = action.payload.total
      state.params = action.payload.params
      state.allData = action.payload.data
      state.allPages = action.payload.allpages
    }),
    builder.addCase(fetchAgentProjectData.fulfilled, (state, action) => {
      state.data = action.payload.data
      state.total = action.payload.total
      state.params = action.payload.params
      state.allData = action.payload.data
      state.allPages = action.payload.allpages
    }),
    builder.addCase(fetchAgentSubscribeData.fulfilled, (state, action) => {
      state.data = action.payload.data
      state.total = action.payload.total
      state.params = action.payload.params
      state.allData = action.payload.data
      state.allPages = action.payload.allpages
    })
  }
})

export default appAgentSlice.reducer
