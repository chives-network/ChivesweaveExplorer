// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'
import authConfig from 'src/configs/auth'

interface DataParams1 {
    address: string
    pageId: number
    pageSize: number
    type: string
}

// ** Fetch Data
export const fetchData = createAsyncThunk('appMyFiles/fetchData', async (params: DataParams1) => {
  
  const response = await axios.get(authConfig.backEndApi + '/file/'+ `${params.type}` + '/'+ `${params.address}` + '/'+ `${params.pageId}` + '/'+params.pageSize)

  const NewData: any[] = response.data.data.filter((record: any) => record.id)
  response.data.data = NewData
  
  return response.data
})

export const appMyFilesSlice = createSlice({
  name: 'appMyFiles',
  initialState: {
    data: [],
    total: 1,
    params: {},
    allData: [],
    allPages: 1,
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchData.fulfilled, (state, action) => {
      state.data = action.payload.data
      state.total = action.payload.total
      state.params = action.payload.params
      state.allData = action.payload.data
      state.allPages = action.payload.allpages
    })
  }
})

export default appMyFilesSlice.reducer
