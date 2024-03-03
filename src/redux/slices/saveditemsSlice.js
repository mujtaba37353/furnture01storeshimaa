import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  data: [],
}
const savedItemsSlice = createSlice({
  name: 'savedItemsSl',
  initialState,
  reducers: {
    getSavedItems: (state, action) => {
      state.data = action.payload
    },
  },
})

export const { getSavedItems } = savedItemsSlice.actions
export default savedItemsSlice.reducer
