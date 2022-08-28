import { createSlice } from "@reduxjs/toolkit";
// 外部コンポーネント
import type { rate_type } from "../types/typeFormat";

export const userInfoSlice = createSlice({
  name: 'user',
  initialState: {
    userID: "",
    fetchedUserID: "",
    userRate: {color:"black", rating:0} as rate_type,
  },
  reducers: {
    setUserID: (state, action) => {
      if (Number.isNaN(action.payload)) return;
      state.userID = action.payload;
    },
    setFetchedUserID: (state, action) => {
      if (Number.isNaN(action.payload)) return;
      state.fetchedUserID = action.payload;
    },
    setUserRate: (state, action) => {
      if (Number.isNaN(action.payload)) return;
      state.userRate = action.payload;
    },
  },
});

export const { setUserID, setFetchedUserID, setUserRate } = userInfoSlice.actions;
export default userInfoSlice.reducer;