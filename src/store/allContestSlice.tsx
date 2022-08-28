import { createSlice } from "@reduxjs/toolkit";
//外部コンポーネント
import type { contest_type } from "../types/typeFormat";

export const allContestSlice = createSlice({
  name: 'contest',
  initialState: {
    allContest: {} as {[id: string]:contest_type},
  },
  reducers: {
    setAllContest: (state, action) => {
      if (Number.isNaN(action.payload)) return;
      state.allContest = action.payload;
    },
  },
});

export const { setAllContest } = allContestSlice.actions;
export default allContestSlice.reducer;