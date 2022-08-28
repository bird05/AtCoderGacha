import { createSlice } from "@reduxjs/toolkit";

export const gachaResultSlice = createSlice({
  name: 'gachaResult',
  initialState: {
    alreadyDraw: false,
    gachaResult: [],
  },
  reducers: {
    setAlreadyDraw: (state, action) => {
      if (Number.isNaN(action.payload)) return;
      state.alreadyDraw = action.payload;
    },
    setGachaResult: (state, action) => {
      if (Number.isNaN(action.payload)) return;
      state.gachaResult = action.payload;
    },
  },
});

export const { setAlreadyDraw, setGachaResult } = gachaResultSlice.actions;
export default gachaResultSlice.reducer;