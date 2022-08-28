import { createSlice } from "@reduxjs/toolkit";
//外部コンポーネント
import type { problem_type } from "../types/typeFormat";

export const allPloblemSlice = createSlice({
  name: 'problem',
  initialState: {
    allProblem: {} as {[id: string]:problem_type},
    alreadyFetched: false,
  },
  reducers: {
    setAllProblem: (state, action) => {
      if (Number.isNaN(action.payload)) return;
      state.allProblem = action.payload;
    },
    setAlreadyFetched: (state, action) => {
      if (Number.isNaN(action.payload)) return;
      state.alreadyFetched = action.payload;
    },
  },
});

export const { setAllProblem, setAlreadyFetched } = allPloblemSlice.actions;
export default allPloblemSlice.reducer;