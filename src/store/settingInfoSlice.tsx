import { createSlice } from "@reduxjs/toolkit";
// const [period, setPeriod] = useState<number[]>([0, 7]);
export const settingInfoSlice = createSlice({
  name: 'setting',
  initialState: {
    gachaType: "全部",
    diff: "全",
    period: [0,7],
    periodAfter: 0,
    periodBefore: 0,
    cnum: 8,
    cdiff1: 1,
  },
  reducers: {
    setGachaType: (state, action) => {
      if (Number.isNaN(action.payload)) return;
      state.gachaType = action.payload;
    },
    setDiff: (state, action) => {
      if (Number.isNaN(action.payload)) return;
      state.diff = action.payload;
    },
    setPeriod: (state, action) => {
      if (Number.isNaN(action.payload)) return;
      state.period = action.payload;
    },
    setPeriodAfter: (state, action) => {
      if (Number.isNaN(action.payload)) return;
      state.periodAfter = action.payload;
    },
    setPeriodBefore: (state, action) => {
      if (Number.isNaN(action.payload)) return;
      state.periodBefore = action.payload;
    },
  },
});

export const { setGachaType, setDiff, setPeriod, setPeriodAfter, setPeriodBefore } = settingInfoSlice.actions;
export default settingInfoSlice.reducer;