import { createSlice } from "@reduxjs/toolkit";

export const userAcSlice = createSlice({
  name: 'userAC',
  initialState: {
    userAcHistory: {} as {[id: string]:number},
    userAcFetchState: 0, // 0フリー,1待機,2取得中,3取得完了
  },
  reducers: {
    setUserAcHistory: (state, action) => {
      if (Number.isNaN(action.payload)) return;
      state.userAcHistory = action.payload;
    },
    setUserAcFetchState: (state, action) => {
      if (Number.isNaN(action.payload)) return;
      state.userAcFetchState = action.payload;
    },
  },
});

export const { setUserAcHistory, setUserAcFetchState } = userAcSlice.actions;
export default userAcSlice.reducer;