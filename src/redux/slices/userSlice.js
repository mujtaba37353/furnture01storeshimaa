import { createSlice } from '@reduxjs/toolkit'
const userSlice = createSlice({
  name: 'userSlice',
  initialState: null,
  reducers: {
    setCurrentUser: (state, { payload }) => (state = { ...payload }),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    removeCurrentUser: (state) => (state = null),
  },
})

export const { setCurrentUser, removeCurrentUser } = userSlice.actions
export default userSlice.reducer
