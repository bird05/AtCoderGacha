import { createSlice } from "@reduxjs/toolkit";
// 外部コンポーネント
import type { rate_type } from "../types/typeFormat";

export const rivalInfoSlice = createSlice({
  name: 'rival',
  initialState: {
    rivalID: "",
    fetchedRivalID: "",
    rivalRate: {color:"black", rating:0} as rate_type,
  },
  reducers: {
    setRivalID: (state, action) => {
      if (Number.isNaN(action.payload)) return;
      state.rivalID = action.payload;
    },
    setFetchedRivalID: (state, action) => {
      if (Number.isNaN(action.payload)) return;
      state.fetchedRivalID = action.payload;
    },
    setRivalRate: (state, action) => {
      if (Number.isNaN(action.payload)) return;
      state.rivalRate = action.payload;
    },
  },
});

export const { setRivalID, setFetchedRivalID, setRivalRate } = rivalInfoSlice.actions;
export default rivalInfoSlice.reducer;