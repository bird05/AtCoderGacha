// CSS
import styled from "@emotion/styled";
import { SDivNowrap, SSpanInlineBlock, SDivDisableText } from '../../css/CommonCSS';
// Redux
import { useSelector } from '../../store/store';
import { useDispatch, shallowEqual } from 'react-redux';
import { setPeriod } from '../../store/settingInfoSlice';
// ビルトインフック
import { useState, memo } from 'react';
// Material UI
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Slider from '@mui/material/Slider';

const periods: string[] =[
  "INF","1year","6months","3months","1month","2weeks","1week","now"
];
function valuetext(value: number){
  return periods[value];
}
const marks = [
  {value: 0, label: 'INF'},
  {value: 1, label: '1y'},
  {value: 2, label: '6m'},
  {value: 3, label: '3m'},
  {value: 4, label: '1m'},
  {value: 5, label: '2w'},
  {value: 6, label: '1w'},
  {value: 7, label: 'now'},
];

export const PeriodSetting = memo((props:any) => {
  const {gachaType} = props;

  // Redux==============================
  const period = useSelector((state) => state.setting.period, shallowEqual);
  const dispatch = useDispatch();
  // State==============================
  const [input_period,set_input_period] = useState([...period]);
  // 関数==============================
  const handleChange = (event: Event, newValue: number | number[]) => {
    set_input_period(newValue as number[]);
  }
  const handleChangeCommited = (event: React.SyntheticEvent | Event, newValue: number | number[]) => {
    const res=newValue as number[];
    dispatch(setPeriod(res));
  }
  // DOM==============================
  return (
    <>
      <Stack direction="row" alignItems="center">
        <SDivNowrap>AC Period:</SDivNowrap>
        {gachaType==="既AC"?<></>:<SDivDisableText><SSpanInlineBlock>Valid Only&nbsp;</SSpanInlineBlock><SSpanInlineBlock>in UserAC</SSpanInlineBlock></SDivDisableText>}
      </Stack>
      
      <SDivSliderOuter>
        <Slider
          getAriaLabel={() => 'Period range'}
          value={input_period}
          onChange={handleChange}
          onChangeCommitted={handleChangeCommited}
          valueLabelDisplay="auto"
          valueLabelFormat={valuetext}
          marks={marks}
          min={0}
          max={7}
          disabled={gachaType!="既AC"}
          //size='small'
        />
      </SDivSliderOuter>

      <Stack direction="row" justifyContent="space-between">
        <SDivSmall>from:{periods[period[0]]}</SDivSmall>
        <SDivSmall>to:{periods[period[1]]}</SDivSmall>
      </Stack>
    </>
  )
});

// Styled CSS==============================
const SDivSmall = styled.div`
font-size: 12px;
`;
const SDivSliderOuter = styled.div`
//width: 160px;
margin:0 auto;
padding-left: 10px;
padding-right: 10px;
`
const SSlider = styled(Slider)`
color: red;
font-size: 5px;
`