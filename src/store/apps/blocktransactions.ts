// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'
import authConfig from 'src/configs/auth'

interface DataParams1 {
    height: number
    pageId: number
    pageSize: number
}

// ** Fetch Data
export const fetchData = createAsyncThunk('appBlockTransactions/fetchData', async (params: DataParams1) => {
  const response = await axios.get(authConfig.backEndApi + '/block/txsrecord/'+ `${params.height}` + '/'+ `${params.pageId}` + '/'+params.pageSize)
  
  const NewData: any[] = response.data.txs.filter((record: any) => record.id)
  response.data.txs = NewData
  
  return response.data
})

export const appBlockTransactionsSlice = createSlice({
  name: 'appBlockTransactions',
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
      state.params = action.payload.block
      state.allData = action.payload.data
    })
  }
})

export default appBlockTransactionsSlice.reducer
