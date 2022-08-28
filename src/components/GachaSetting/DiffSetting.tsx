// CSS
import styled from "@emotion/styled";
// Redux
import { useSelector } from '../../store/store';
import { useDispatch } from 'react-redux';
import { setUserID, setUserRate } from '../../store/userInfoSlice';
import { setGachaType, setDiff } from '../../store/settingInfoSlice';

export const DiffSetting = (props:any) => {
  const { onChangeDiffSetting} = props;

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