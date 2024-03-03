import { createSlice } from '@reduxjs/toolkit'
const scrollActivitySlice = createSlice({
  name: 'scrollActivitySlice',
  initialState: {
    value: false,
  },
  reducers: {
    toggleActivity: (state, action) => {
      state.value = action.payload
    },
  },
})

export const { toggleActivity } = scrollActivitySlice.actions
export default scrollActivitySlice.reducer
