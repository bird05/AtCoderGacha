import { createSlice } from "@reduxjs/toolkit";

export const rivalAcSlice = createSlice({
  name: 'rivalAC',
  initialState: {
    rivalAcHistory: {} as {[id: string]:number},
    rivalAcFetchState: 0, // 0フリー,1待機,2取得中,3取得完了
  },
  reducers: {
    setRivalAcHistory: (state, action) => {
      if (Number.isNaN(action.payload)) return;
      state.rivalAcHistory = action.payload;
    },
    setRivalAcFetchState: (state, action) => {
      if (Number.isNaN(action.payload)) return;
      state.rivalAcFetchState = action.payload;
    },
  },
});

export const { setRivalAcHistory, setRivalAcFetchState } = rivalAcSlice.actions;
export default rivalAcSlice.reducer;