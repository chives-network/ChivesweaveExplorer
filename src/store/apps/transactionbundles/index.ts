// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'
import authConfig from 'src/configs/auth'

interface DataParams1 {
    tx: string
    pageId: number
    pageSize: number
}

// ** Fetch Data
export const fetchData = createAsyncThunk('appTransactionBundles/fetchData', async (params: DataParams1) => {
  const response = await axios.get(authConfig.backEndApi + '/tx/'+ `${params.tx}` + '/unbundle/'+ `${params.pageId}` + '/'+params.pageSize)
  
  return response.data
})

export const appTransactionBundlesSlice = createSlice({
  name: 'appTransactionBundles',
  initialState: {
    data: [],
    total: 1,
    params: {},
    allData: []
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchData.fulfilled, (state, action) => {
      state.data = action.payload.txs
      state.total = action.payload.total
      state.params = action.payload.params
      state.allData = action.payload.data
    })
  }
})

export default appTransactionBundlesSlice.reducer
