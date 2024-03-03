import {  createSlice } from "@reduxjs/toolkit";



export const NewCartSlice = createSlice({

    name:'NcartReducer',
    initialState:{
        Total:0

    },
    reducers:{
        SetTotal:(state,action)=>{
            state.Total=action.payload
        }
    }

});

export const NewCartReducer = NewCartSlice.reducer;
export const NewCartAction = NewCartSlice.actions;
 