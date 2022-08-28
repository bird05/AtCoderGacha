import { createSlice } from "@reduxjs/toolkit";

export const gachaContentAllSlice = createSlice({
  name: 'gachaContentAll',
  initialState: {
    groupSize: 20,
    groupedProblem: [[]],
    selectedGroup: 0,
  },
  reducers: {
    setGroupSize: (state, action) => {
      if (Number.isNaN(action.payload)) return;
      state.groupSize = action.payload;
    },
    setGroupedProblem: (state, action) => {
      if (Number.isNaN(action.payload)) return;
      state.groupedProblem = action.payload;
    },
    setSelectedGroup: (state, action) => {
      if (Number.isNaN(action.payload)) return;
      state.selectedGroup = action.payload;
    },
  },
});

export const { setGroupSize, setGroupedProblem, setSelectedGroup } = gachaContentAllSlice.actions;
export default gachaContentAllSlice.reducer;