import { createSelector } from "@reduxjs/toolkit";

const state = (state)=>state;


export const currencySelector = createSelector([state],({currency})=>{
return currency
})