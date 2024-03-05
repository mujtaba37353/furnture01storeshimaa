import { createSlice } from "@reduxjs/toolkit";

const repoProductsSlice = createSlice({
  name: "repoProsSlice",
  initialState: {
    items: [],
    repoModalProsucts: [],
  },
  reducers: {
    setAllRepoProducts: (state, action) => {
      state.items = action.payload;
    },
  },
});

export const { setAllRepoProducts } = repoProductsSlice.actions;
export default repoProductsSlice.reducer;
  