import { createSlice } from '@reduxjs/toolkit'

export const CurrencySlice = createSlice({
  name: 'currency',
  initialState: { currencyPrice: 1, label: 'SAR' },
  reducers: {
    setCurrency: (state, action) => {
      const { currency, label } = action.payload
      state.currencyPrice = currency
      state.label = label
    },
  },
})

export const CurencyActions = CurrencySlice.actions
