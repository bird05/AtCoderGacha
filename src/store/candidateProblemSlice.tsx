import { createSlice } from "@reduxjs/toolkit";

export const candidatePloblemSlice = createSlice({
  name: 'c_problem',
  initialState: {
    candidateProblem: [],
  },
  reducers: {
    setCandidateProblem: (state, action) => {
      if (Number.isNaN(action.payload)) return;
      state.candidateProblem = action.payload;
    },
  },
});

export const { setCandidateProblem } = candidatePloblemSlice.actions;
export default candidatePloblemSlice.reducer;