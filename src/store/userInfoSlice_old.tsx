// このファイルは不要になった気がする
import { createSlice } from "@reduxjs/toolkit";

// 型定義
type problem_type ={
  lastAC: number;
  diff: number;
  solver: number;
}

export const userInfoSlice = createSlice({
  name: 'user',
  initialState: {
    userID: "",
    userRate: 0,
    userAC: {} as {[id: string]:problem_type},
  },
  reducers: {
    setUserID: (state, action) => {
      if (Number.isNaN(action.payload)) return;
      state.userID = action.payload;
    },
    setUserRate: (state, action) => {
      if (Number.isNaN(action.payload)) return;
      state.userRate = action.payload;
    },
    setUserAC: (state, action) => {
      if (Number.isNaN(action.payload)) return;
      state.userAC = action.payload;
    },
  },
});

export const { setUserID, setUserRate, setUserAC } = userInfoSlice.actions;
export default userInfoSlice.reducer;