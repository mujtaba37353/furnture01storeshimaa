import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  data: [],
}
const bestSellerProductsSlice = createSlice({
  name: 'bestSellerProducts1',
  initialState,
  reducers: {
    getBestItems: (state, action) => {
      state.data = action.payload
    },
  },
})

export const { getBestItems } = bestSellerProductsSlice.actions
export default bestSellerProductsSlice.reducer
