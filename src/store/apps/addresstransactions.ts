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
export const fetchData = createAsyncThunk('appAddressTransactions/fetchData', async (params: DataParams1) => {
  let addressApiType = "";
  switch(params.type) {
    case 'all':
      addressApiType = "txsrecord";
      break;
    case 'sent':
      addressApiType = "send";
      break;
    case 'received':
      addressApiType = "deposits";
      break;
    case 'files':
      addressApiType = "datarecord";
      break;
  }
  if(addressApiType && addressApiType!="")  {
    const response = await axios.get(authConfig.backEndApi + '/wallet/'+ `${params.address}` + '/'+ `${addressApiType}` + '/'+ `${params.pageId}` + '/'+params.pageSize)
    
    const NewData: any[] = response.data.data.filter((record: any) => record.id)
    response.data.data = NewData
    
    return response.data
  }
  else {
    return {data:[], total:0, params}
  }
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
