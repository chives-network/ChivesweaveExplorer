// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'
import authConfig from 'src/configs/auth'

interface DataParams {
  pageId: number
  pageSize: number
}

// ** Fetch Data
export const fetchData = createAsyncThunk('appTransactions/fetchData', async (params: DataParams) => {
  const response = await axios.get(authConfig.backEndApi + '/transaction/'+ `${params.pageId}` + '/'+params.pageSize)
  console.log("params", params)
  
  return response.data
})

export const appTransactionsSlice = createSlice({
  name: 'appTransactions',
  initialState: {
    data: [],
    total: 1,
    params: {},
    allData: []
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchData.fulfilled, (state, action) => {
      state.data = action.payload.data
      state.total = action.payload.total
      state.params = action.payload.params
      state.allData = action.payload.data
    })
  }
})

export default appTransactionsSlice.reducer
