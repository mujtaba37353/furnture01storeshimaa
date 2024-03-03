import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  refetching: false,
}
const refetchSlice = createSlice({
  name: 'refetchData',
  initialState,
  reducers: {
    setRefetch: (state) => {
      state.refetching = true
    },
    unsetRefetch: (state) => {
      state.refetching = false
    },
  },
})

export const { setRefetch, unsetRefetch } = refetchSlice.actions
export default refetchSlice.reducer
