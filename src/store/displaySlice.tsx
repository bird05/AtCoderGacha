import { createSlice } from "@reduxjs/toolkit";

export const displaySlice = createSlice({
  name: 'display',
  initialState: {
    gachaDisplay: "gacha",
  },
  reducers: {
    setGachaDisplay: (state, action) => {
      if (Number.isNaN(action.payload)) return;
      state.gachaDisplay = action.payload;
    },
  },
});

export const { setGachaDisplay } = displaySlice.actions;
export default displaySlice.reducer;