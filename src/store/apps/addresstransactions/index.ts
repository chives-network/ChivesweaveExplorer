// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'
import authConfig from 'src/configs/auth'

interface DataParams1 {
    address: string
    pageId: number
    pageSize: number
}

// ** Fetch Data
export const fetchData = createAsyncThunk('appAddressTransactions/fetchData', async (params: DataParams1) => {
  const response = await axios.get(authConfig.backEndApi + '/wallet/'+ `${params.address}` + '/txsrecord/'+ `${params.pageId}` + '/'+params.pageSize)
  console.log("appAddressTransactions/fetchData", params)
  
  return response.data
})

export const appAddressTransactionsSlice = createSlice({
  name: 'appAddressTransactions',
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

export default appAddressTransactionsSlice.reducer
