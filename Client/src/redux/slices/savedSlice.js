import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  saved: 0,
}
const SavedSlice = createSlice({
  name: 'saved',
  initialState,
  reducers: {
    incrementSaved: (state) => {
      state.saved++
    },
    setSaved: (state, action) => {
      state.saved = action.payload
    },
    descrementSaved: (state) => {
      state.saved--
    },
  },
})

export const { incrementSaved, setSaved, descrementSaved } = SavedSlice.actions
export default SavedSlice.reducer
