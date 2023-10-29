// ** Toolkit imports
import { configureStore } from '@reduxjs/toolkit'

// ** Reducers
import blocks from 'src/store/apps/blocks'
import transactions from 'src/store/apps/transactions'
import addresstransactions from 'src/store/apps/addresstransactions'
import addresses from 'src/store/apps/addresses'

export const store = configureStore({
  reducer: {
    blocks,
    transactions,
    addresstransactions,
    addresses
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
