// CSS
import styled from "@emotion/styled";
// Redux
import { useSelector } from '../../store/store';
import { shallowEqual } from 'react-redux';
//import { setUserID, setUserRate } from '../../store/userInfoSlice';
//import { setGachaType, setDiff } from '../../store/settingInfoSlice';
// ビルトインフック
import { useEffect } from 'react';

export const DiffSetting = (props:any) => {
  const { onChangeDiffSetting } = props;

  const settedDiff = useSelector((state) => state.setting.diff, shallowEqual);

  // 画面サイズ変更時に選択中のdiffを表示する
  const setCurrentDiff = () => {
    let element = document.getElementById("diffSelect") as HTMLSelectElement;
    let options = element.options;
    if(settedDiff==="全?") options[0].selected=true;
    else if(settedDiff==="全") options[1].selected=true;
    else if(settedDiff==="灰") options[2].selected=true;
    else if(settedDiff==="茶") options[3].selected=true;
    else if(settedDiff==="緑") options[4].selected=true;
    else if(settedDiff==="水") options[5].selected=true;
    else if(settedDiff==="青") options[6].selected=true;
    else if(settedDiff==="黄") options[7].selected=true;
    else if(settedDiff==="橙") options[8].selected=true;
    else if(settedDiff==="赤") options[9].selected=true;
    else if(settedDiff==="銅") options[10].selected=true;
    else if(settedDiff==="銀") options[11].selected=true;
    else if(settedDiff==="金") options[12].selected=true;
  };

  useEffect(() => {
    setCurrentDiff();
  },[settedDiff])

  // DOM==============================
  return (
    <>
      <div>
        Difficulty:
        <select id="diffSelect" onChange={onChangeDiffSetting}>
          <option value="全?">All:Including '?'</option>
          <option value="全">All:0-inf</option>
          <option value="灰">灰:0-399</option>
          <option value="茶">茶:400-799</option>
          <option value="緑">緑:800-1199</option>
          <option value="水">水:1200-1599</option>
          <option value="青">青:1600-1999</option>
          <option value="黄">黄:2000-2399</option>
          <option value="橙">橙:2400-2799</option>
          <option value="赤">赤:2800-3199</option>
          <option value="銅">銅:3200-3599</option>
          <option value="銀">銀:3600-3999</option>
          <option value="金">金:4000-inf</option>
        </select>
      </div>
    </>
  )
};