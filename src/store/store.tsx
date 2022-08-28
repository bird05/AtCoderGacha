import { configureStore } from "@reduxjs/toolkit";
import { useSelector as rawUseSelector, TypedUseSelectorHook } from 'react-redux';
import allProblemReducer from './allProblemSlice';
import allContestReducer from './allContestSlice';
import userAcReducer from './userAcSlice';
import rivalAcReducer from './rivalAcSlice';
import candidateProblemReducer from './candidateProblemSlice';
import userInfoReducer from './userInfoSlice';
import rivalInfoReducer from './rivalInfoSlice';
import settingInfoReducer from './settingInfoSlice';
import displayReducer from './displaySlice';
import gachaResultReducer from './gachaResultSlice';
import gachaContentAllReducer from './gachaContentAllSlice';

export const store = configureStore({
  reducer: {
    problem: allProblemReducer,
    contest: allContestReducer,
    userAC: userAcReducer,
    rivalAC: rivalAcReducer,
    c_problem: candidateProblemReducer,
    user: userInfoReducer,
    rival: rivalInfoReducer,
    setting: settingInfoReducer,
    display: displayReducer,
    gachaResult: gachaResultReducer,
    gachaContentAll: gachaContentAllReducer,
  }
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export const useSelector: TypedUseSelectorHook<RootState> = rawUseSelector;