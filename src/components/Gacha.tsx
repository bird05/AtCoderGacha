// CSS
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
// Redux
import { useSelector } from '../store/store';
import { useDispatch, shallowEqual } from 'react-redux';
//import { setGachaDisplay } from '../store/displaySlice';
import { setAlreadyDraw, setGachaResult } from '../store/gachaResultSlice';
// hooks
//import { useFetchAtcoder } from '../hooks/useFetchData';
// MUI
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
// ビルトインフック
import { useState, useEffect } from 'react';
// 外部コンポーネント
import type { problem_type, problem_disp_type } from "../types/typeFormat";
import { shuffledPermutation,randNums,diffToColor,solversToRarity,diff_mark,description_RarityToSolvers,description_diff,epocToDate } from "./Functions";
import { SADiffColor,SALinkColor,SDivNarrow,SDivTitle,SDivFlame,SDivNoLine,SDivLLine } from "../css/CommonCSS";

export const Gacha = (props:any) => {
  const { isWide, toGachaContetAll } = props;
  
  // カスタムフック==============================

  // State==============================
  //const [gachaResult,setGachaResult] = useState<problem_disp_type[]>([]); // storeに移した

  // Redux==============================
  const allProblem = useSelector((state) => state.problem.allProblem, shallowEqual);
  const allContest = useSelector((state) => state.contest.allContest, shallowEqual);
  const candidateProblem = useSelector((state) => state.c_problem.candidateProblem, shallowEqual);
  const userAcHistory = useSelector((state) => state.userAC.userAcHistory, shallowEqual);
  const alreadyDraw = useSelector((state) => state.gachaResult.alreadyDraw, shallowEqual);
  const gachaResult = useSelector((state) => state.gachaResult.gachaResult, shallowEqual);
  const dispatch = useDispatch();
  
  // Styled CSS==============================
  const SH3 = styled.h3`
  margin-top:0;
  margin-bottom:0;
  `;
  const SDivHidden = styled.div`
  overflow-x: hidden;
  `
  // ボタン
  const SButtonToContent = styled.button`
  margin-left: auto;
  `
  const SButtonGacha = styled.button`
  font-size: 20px;
  `
  // アニメーション
  const shift = keyframes`
  0%{
    left: ${alreadyDraw?"0px":"max(110vw, 1300px)"};
  }
  100%{
    left: 0px;
  }
  `
  const SDivAnim = styled.div<{
    delay: number;
  }>`
  position: relative;
  left: max(110vw, 1300px);
  animation-name: ${shift};
  animation-duration: 1s;
  animation-timing-function: ease-out;
  animation-delay: ${({ delay }) => delay }s;
  animation-iteration-count: 1;
  animation-fill-mode: forwards;
  }
  `
  
  // 関数==============================
  // 画面サイズ変更時に選択中のdiffを表示する
  // ガチャ引き終わりのタイミングでフラグをセットする
  const sleepAndSetDrawFlag = async () => {
    await new Promise(s => setTimeout(s, 2000)); // 2sec待機
    dispatch(setAlreadyDraw(true)); // フラグセット
  }
  // 処理本体==========
  const drawGacha = () => {
    dispatch(setAlreadyDraw(false)); // フラグリセット
    let p_num = Object.keys(candidateProblem).length // 候補問題数
    
    // 候補問題から表示する問題を選ぶ==========
    let arr_idx:number[]=[];
    // 問題数が0の場合
    if(p_num==0){
      // ボタンを無効化する
      
    // 問題数が10以下の場合
    }else if(p_num<=10){
      arr_idx=shuffledPermutation(p_num);
    // 問題数が10より多い場合
    }else{
      arr_idx=randNums(p_num);
    }

    // 選択したものから表示内容を作成する==========
    let arr_disp_info:problem_disp_type[]=[];
    for(let i=0; i<arr_idx.length; ++i){
      const problem_id:string=candidateProblem[arr_idx[i]];
      const one_p:problem_type=allProblem[problem_id];
      const contest_id:string=one_p.contest_id;
      // date
      const u_sec=allContest[contest_id].start_epoch;
      const date_str=epocToDate(u_sec);
      // lastAcDate
      let lastAc_str="-";
      if(problem_id in userAcHistory){
        lastAc_str=epocToDate(userAcHistory[problem_id]);
      }
      // diff
      //const diff_str=(one_p.diff===-1)?"-":String(one_p.diff);
      let buf:problem_disp_type={
        rarity: solversToRarity(one_p.solver),
        solvers: one_p.solver,
        date: date_str,
        problem: one_p.problem_name,
        contest: allContest[contest_id].title,
        lastAcDate: lastAc_str,
        //diff: diff_str,
        diff: one_p.diff,
        contest_id: contest_id,
        problem_id: problem_id,
      };
      arr_disp_info.push(buf);
    }
    // 結果がない場合の処理
    if(arr_disp_info.length==0){
      let buf:problem_disp_type={
        rarity: "none",
        solvers: 0,
        date: "none",
        problem: "none",
        contest: "none",
        lastAcDate: "none",
        //diff: "-",
        diff: -1,
        contest_id: "",
        problem_id: "",
      };
      arr_disp_info.push(buf);
    }
    dispatch(setGachaResult(arr_disp_info));
    sleepAndSetDrawFlag();
  };

  // useEffect==============================

  // DOM==============================
  //console.log("Gacha");
  return (
    <>
      <SDivHidden>
        <Stack direction="row" justifyContent="flex-end">
          <SButtonToContent onClick={toGachaContetAll}>See Gacha Contents{' >>'}</SButtonToContent>
        </Stack>      
        <div>
          <SH3>Gacha</SH3>
        </div>
        <SButtonGacha onClick={drawGacha} disabled={Object.keys(candidateProblem).length===0}>Draw the Gacha</SButtonGacha>
        
        <SDivTitle isWide={isWide} isMgnBtm={true}>
          <Stack direction="row">
            <SDivNoLine isWide={isWide}>Rarity</SDivNoLine>
            <SDivLLine isWide={isWide}>Solvers</SDivLLine>
            <SDivLLine isWide={isWide}>Date</SDivLLine>
            <SDivLLine isWide={isWide}>Problem</SDivLLine>
            <SDivLLine isWide={isWide}>Contest</SDivLLine>
            <SDivLLine isWide={isWide}>Last AC Date</SDivLLine>
            {/*<SDivLLine>Difficulty</SDivLLine>*/}
          </Stack>
        </SDivTitle>
        
        {gachaResult.map((elem: problem_disp_type, index: number) => (
          <SDivAnim delay={alreadyDraw ? 0 : index/10} key={index}>
            <SDivFlame rarity={elem.rarity} isWide={isWide} isSeparated={true}>
              <Stack direction="row">
                <SDivNoLine isWide={isWide}>
                  <Tooltip title={description_RarityToSolvers(elem.solvers)} arrow placement="top">
                    <span>{elem.rarity}</span>
                  </Tooltip>
                </SDivNoLine>
                <SDivLLine isWide={isWide}>{elem.solvers}</SDivLLine>
                <SDivLLine isWide={isWide}>{elem.date}</SDivLLine>
                <SDivLLine isWide={isWide}>
                  <SDivNarrow>
                    <Tooltip title={description_diff(elem.diff)} arrow placement="top">
                      {diff_mark(elem.diff)}
                    </Tooltip>
                    <SADiffColor diff={elem.diff} href={"https://atcoder.jp/contests/"+elem.contest_id+"/tasks/"+elem.problem_id} target="_blank" rel="noopener">
                      {elem.problem}
                    </SADiffColor>
                  </SDivNarrow>
                </SDivLLine>
                <SDivLLine isWide={isWide}>
                <SDivNarrow>
                  <SALinkColor href={"https://atcoder.jp/contests/"+elem.contest_id} target="_blank" rel="noopener">
                  {elem.contest}
                  </SALinkColor>
                  </SDivNarrow>
                </SDivLLine>
                <SDivLLine isWide={isWide}>{elem.lastAcDate}</SDivLLine>
                {/*<SDivLLine>{elem.diff}</SDivLLine>*/}
              </Stack>
            </SDivFlame>
          </SDivAnim>
        ))}
      </SDivHidden>
    </>
  )
};