// CSS
import styled from "@emotion/styled";
// 外部コンポーネント
import { Gacha } from './Gacha';
import { GachaContentAll } from './GachaContentAll';
// Redux
import { useSelector } from '../store/store';
import { useDispatch, shallowEqual } from 'react-redux';
import { setGachaDisplay } from '../store/displaySlice';
import { setGachaType, setDiff } from '../store/settingInfoSlice';
// hooks
// MUI
// ビルトインフック
import { useState } from 'react';

// DOM==============================
//console.log("Main");
export const Main = (props:any) => {
  const {isWide} = props;
  // カスタムフック==============================
  // State==============================

  // Redux==============================
  const gachaDisplay = useSelector(state => state.display.gachaDisplay, shallowEqual);
  const dispatch = useDispatch();

  // Styled CSS==============================
  const SDivScroll = styled.div`
  height: ${isWide?"100%":"100vh"};//ここを変える必要がありそう 
  overflow-y: ${isWide?"scroll":"visible"};
  `
  // 関数==============================
  const toGachaContetAll = () => {
    dispatch(setGachaDisplay("content"));
  }
  const toGacha = () => {
    dispatch(setGachaDisplay("gacha"));
  }
  // useEffect==============================


  //dispatch(setGachaType("既AC"));
  //dispatch(setDiff("緑"));

  // DOM==============================
  //console.log("main");
  return (
    <>
      <SDivScroll>
        {gachaDisplay==="gacha"
        ?<Gacha isWide={isWide} toGachaContetAll={toGachaContetAll}/>
        :<GachaContentAll isWide={isWide} toGacha={toGacha}/>}
      </SDivScroll>
    </>
  );
};