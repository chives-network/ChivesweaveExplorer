// ** Toolkit imports
import { configureStore } from '@reduxjs/toolkit'

// ** Reducers
import blocks from 'src/store/apps/blocks'
import transactions from 'src/store/apps/transactions'
import addresstransactions from 'src/store/apps/addresstransactions'
import blocktransactions from 'src/store/apps/blocktransactions'
import transactionbundles from 'src/store/apps/transactionbundles'
import addresses from 'src/store/apps/addresses'

export const store = configureStore({
  reducer: {
    blocks,
    transactions,
    addresstransactions,
    blocktransactions,
    transactionbundles,
    addresses
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
