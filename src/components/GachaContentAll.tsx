// CSS
import styled from "@emotion/styled";
// Redux
import { useSelector } from '../store/store';
import { useDispatch, shallowEqual } from 'react-redux';
import { setGachaDisplay } from '../store/displaySlice';
import { setGroupSize, setGroupedProblem, setSelectedGroup } from '../store/gachaContentAllSlice';
// hooks
//import { useFetchAtcoder } from '../hooks/useFetchData';
// MUI
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Pagination from '@mui/material/Pagination';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Tooltip from '@mui/material/Tooltip';
// ビルトインフック
import { FC, useState, useEffect } from 'react';
// 外部コンポーネント
//import type { problem_type, problem_disp_type } from "../types/typeFormat";
import { diffToColor,solversToRarity,diff_mark,description_RarityToSolvers,description_diff,epocToDate } from "./Functions";
import { SSpan,SSpanMetal,SADiffColor,SALinkColor,SDivNarrow,SDivTitle,SDivFlame,SDivNoLine,SDivLLine } from "../css/CommonCSS";

type Props = {};
export const GachaContentAll: FC<any> = props => {
  const { isWide,toGacha } = props;

  // カスタムフック==============================

  // State==============================
  const [inputPage,setInputPage] = useState(1);
  //const [groupSize,setGroupSize] = useState(20);
  //const [groupedProblem,setGroupedProblem] = useState<string[][]>([[]]);
  //const [selectedGroup,setSelectedGroup] = useState(0);

  // Redux==============================
  const allProblem = useSelector((state) => state.problem.allProblem, shallowEqual);
  const allContest = useSelector((state) => state.contest.allContest, shallowEqual);
  const candidateProblem = useSelector((state) => state.c_problem.candidateProblem, shallowEqual);
  const userAcHistory = useSelector((state) => state.userAC.userAcHistory, shallowEqual);
  const groupSize = useSelector((state) => state.gachaContentAll.groupSize, shallowEqual);
  const groupedProblem = useSelector((state) => state.gachaContentAll.groupedProblem, shallowEqual);
  const selectedGroup = useSelector((state) => state.gachaContentAll.selectedGroup, shallowEqual);
  const dispatch = useDispatch();

  // Styled CSS==============================
  const SH3 = styled.h3`
    margin-top:0;
    margin-bottom:0;
  `;
  
  // 関数==============================
  
  // 候補問題をグループに分割する処理
  const groupingProblem = () => {
    const arr_2D: Array<Array<string>> = new Array();
    const N=candidateProblem.length;
    //const groupSize=20;
    const group_num=Math.ceil(N/groupSize);
    for(let i=0; i<group_num; ++i){
      arr_2D[i]=new Array();
      for(let j=0; j<groupSize; ++j){
        if(i*groupSize+j>=N) break;
        arr_2D[i][j]=candidateProblem[i*groupSize+j];
      }
    }
    
    // 変化があれば更新してページ数を先頭にする
    if(JSON.stringify(groupedProblem)!=JSON.stringify(arr_2D)){
      setInputPage(1);
      dispatch(setSelectedGroup(0));
      dispatch(setGroupedProblem(arr_2D));
    }
  }
  // 1グループの問題数が変更されたときの処理(ここの処理は同じグループ数を選択した場合は走らない)
  const groupSizeChange = (event: SelectChangeEvent) => {
    dispatch(setGroupSize(Number(event.target.value)));
  };
  // テキストボックスでページ番号変更時の処理
  const changeTextPage = (page_num:number) => {
    if(page_num<=0) page_num=1; // 下限修正
    if(groupedProblem.length<page_num) page_num=groupedProblem.length; // 上限修正
    setInputPage(page_num);
    dispatch(setSelectedGroup(page_num-1));
  }
  // テキストボックスでページ番号確定時の処理
  const enterText_Page = () => {
    let jump_page=inputPage; // 1-indexed
    if(jump_page<=0) jump_page=1; // 下限修正
    if(groupedProblem.length<jump_page) jump_page=groupedProblem.length; // 上限修正
    setInputPage(jump_page);
    dispatch(setSelectedGroup(jump_page-1));
  }
  // paginationクリック時の処理
  const changeDisplayGroup = (event: React.ChangeEvent<unknown>, page: number) => {
    setInputPage(page);
    dispatch(setSelectedGroup(page-1));
  }

  // useEffect==============================
  // ページを開いたとき
  // 全問題読み込み
  useEffect(() => {
    if(candidateProblem.length>0) groupingProblem(); // 候補問題をグループ分け
    else dispatch(setGroupedProblem([[]])); // 空にする
  }, [candidateProblem,groupSize]);

  // DOM==============================
  //console.log("GachaContentAll");
  return (
    <>
      <button onClick={toGacha}>{'<< '}Gacha</button>
      <div>
        <SH3>Gacha Content</SH3>
      </div>
      <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
        <Box sx={{ maxWidth:100 }}>
          <FormControl size='small' fullWidth>
            <Select defaultValue={"20"} onChange={groupSizeChange}>
              <MenuItem value={20}>20</MenuItem>
              <MenuItem value={50}>50</MenuItem>
              <MenuItem value={100}>100</MenuItem>
              <MenuItem value={200}>200</MenuItem>
              <MenuItem value={10000}>All</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Stack direction="row" alignItems="center">
          <Box sx={{ maxWidth:100 }}>
            <TextField
              onChange={(event) => changeTextPage(Number(event.target.value))} 
              onKeyDown={e => {if(e.keyCode===13){enterText_Page();}}}
              value={inputPage}
              inputProps={{min:1,max:groupedProblem.length}}
              label="Page" type="number" InputLabelProps={{shrink:true}} size='small'
            />
          </Box>
          <Pagination count={groupedProblem.length} onChange={changeDisplayGroup} page={selectedGroup+1} showFirstButton showLastButton />
        </Stack>
        
      </Stack>
      
      <SDivTitle isWide={isWide} isMgnBtm={false}>
        <Stack direction="row">
          <SDivNoLine isWide={isWide}>Rarity</SDivNoLine>
          <SDivLLine isWide={isWide}>Solvers</SDivLLine>
          <SDivLLine isWide={isWide}>Date</SDivLLine>
          <SDivLLine isWide={isWide}>Problem</SDivLLine>
          <SDivLLine isWide={isWide}>Contest</SDivLLine>
          <SDivLLine isWide={isWide}>Last AC Date</SDivLLine>
        </Stack>
      </SDivTitle>

      {groupedProblem[selectedGroup].map((id: string, index: number) => (
        <SDivFlame rarity={solversToRarity(allProblem[id].solver)} isWide={isWide} isSeparated={false} key={index}>
          <Stack direction="row">
            <SDivNoLine isWide={isWide}>
              <Tooltip title={description_RarityToSolvers(allProblem[id].solver)} arrow placement="top">
                <span>{solversToRarity(allProblem[id].solver)}</span>
              </Tooltip>
            </SDivNoLine>
            <SDivLLine isWide={isWide}>{allProblem[id].solver}</SDivLLine>
            <SDivLLine isWide={isWide}>{epocToDate(allContest[allProblem[id].contest_id].start_epoch)}</SDivLLine>
            <SDivLLine isWide={isWide}>
            <SDivNarrow>
              <Tooltip title={description_diff(allProblem[id].diff)} arrow placement="top">
                {diff_mark(allProblem[id].diff)}
              </Tooltip>
              <SADiffColor diff={allProblem[id].diff} href={"https://atcoder.jp/contests/"+allProblem[id].contest_id+"/tasks/"+id} target="_blank" rel="noopener">
                {allProblem[id].problem_name}
              </SADiffColor>
            </SDivNarrow>
            </SDivLLine>
            <SDivLLine isWide={isWide}>
              <SDivNarrow>
                <SALinkColor href={"https://atcoder.jp/contests/"+allProblem[id].contest_id} target="_blank" rel="noopener">
                  {allContest[allProblem[id].contest_id].title}
                </SALinkColor>
              </SDivNarrow>
            </SDivLLine>
            <SDivLLine isWide={isWide}>{(id in userAcHistory)?epocToDate(userAcHistory[id]):"-"}</SDivLLine>
          </Stack>
        </SDivFlame>
      ))}

    </>
  )
};