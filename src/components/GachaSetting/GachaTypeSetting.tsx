// CSS
import styled from "@emotion/styled";
// Redux
import { useSelector } from '../../store/store';
import { shallowEqual } from 'react-redux';
//import { setUserID, setUserRate } from '../../store/userInfoSlice';
//import { setGachaType, setDiff } from '../../store/settingInfoSlice';
// ビルトインフック
import { useEffect } from 'react';

export const GachaTypeSetting = (props:any) => {
  const { onChangeGachaType } = props;

  const gachaType = useSelector((state) => state.setting.gachaType, shallowEqual);

  // 画面サイズ変更時に選択中のガチャタイプを表示する
  const setCurrentType = () => {
    let element = document.getElementById("gachaTypeSelect") as HTMLSelectElement;
    let options = element.options;
    if(gachaType==="全部") options[0].selected=true;
    else if(gachaType==="既AC") options[1].selected=true;
    else if(gachaType==="未AC") options[2].selected=true;
    else if(gachaType==="ライバル") options[3].selected=true;
  };

  useEffect(() => {
    setCurrentType();
  },[gachaType])

  // DOM==============================
  return (
    <>
      Gacha Type:
      <select id="gachaTypeSelect" onChange={onChangeGachaType}>
        <option value="全部">All</option>
        <option value="既AC">userAC</option>
        <option value="未AC">All - userAC</option>
        <option value="ライバル">rivalAC - userAC</option>
      </select>
    </>
  )
};