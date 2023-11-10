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
export const fetchData = createAsyncThunk('appAddresses/fetchData', async (params: DataParams) => {
  const response = await axios.get(authConfig.backEndApi + '/address/'+ `${params.pageId}` + '/'+params.pageSize)
  
  const NewData: any[] = response.data.data.filter((record: any) => record.id)
  response.data.data = NewData
  
  return response.data
})

export const appAddressesSlice = createSlice({
  name: 'appAddresses',
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
      state.allData = action.payload.users
    })
  }
})

export default appAddressesSlice.reducer
