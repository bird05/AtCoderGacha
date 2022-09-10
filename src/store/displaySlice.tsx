import { createSlice } from "@reduxjs/toolkit";

export const displaySlice = createSlice({
  name: 'display',
  initialState: {
    gachaDisplay: "gacha",
    mainElemHeight: 0,
  },
  reducers: {
    setGachaDisplay: (state, action) => {
      if (Number.isNaN(action.payload)) return;
      state.gachaDisplay = action.payload;
    },
    setMainElemHeight: (state, action) => {
      if (Number.isNaN(action.payload)) return;
      state.mainElemHeight = action.payload;
    },
  },
});

export const { setGachaDisplay, setMainElemHeight } = displaySlice.actions;
export default displaySlice.reducer;