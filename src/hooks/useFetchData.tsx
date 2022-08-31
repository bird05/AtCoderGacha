import { useState } from "react";
import axios from "axios";
// Redux
import { useDispatch, shallowEqual } from 'react-redux';
import { setAllProblem, setAlreadyFetched } from '../store/allProblemSlice';
import { setAllContest } from '../store/allContestSlice';
import { setUserAcHistory, setUserAcFetchState } from '../store/userAcSlice';
import { setRivalAcHistory, setRivalAcFetchState } from '../store/rivalAcSlice';
// 後でライバルもやる
import { setUserID, setUserRate } from '../store/userInfoSlice'; // デバッグ
import { setRivalID, setRivalRate } from '../store/rivalInfoSlice';
import { useSelector } from '../store/store'; // デバッグ
// 外部コンポーネント
import { getRandomInt } from "../components/Functions";
import type { problem_type, contest_type, submission_type, rate_type } from "../types/typeFormat";

// ユーザーデータの取得
// レート,AC履歴
export const useFetchAtcoder = () => {
  // 手順
  // 1.問題一覧の配列を取得し、問題一覧の辞書を作成(この時点ではlastACを-1にする)(ページ起動時)
  // 2.自分のAC一覧の配列を取得(名前入力時)
  // 3.1.のlastACを上書き(1,2両方終わった後)
  // 4.1.から自分の既AC,未ACのsetを作成(3が終わった後)
  
  // State==============================
  // 全問題
  //const [allProblem_l, setAllProblem_l] = useState({
  //  data: [],
  //  isLoaded: false,
  //})
  // ユーザー
  /*
  const [subData, setSubData] = useState({
    data: [],
    isLoaded: false,
  });
  const [rate, setRate] = useState<rate_type>({
    color: "",
    rating: 0,
    status: "",
  });
  // ライバル
  const [subDataRival, setSubDataRival] = useState({
    data: [],
    isLoaded: false,
  });
  const [rateRival, setRateRival] = useState<rate_type>({
    color: "",
    rating: 0,
    status: "",
  });
  */
  
  // Redux==============================
  //const allProblem = useSelector((state) => state.problem.allProblem); // デバッグ
  const alreadyFetched = useSelector((state) => state.problem.alreadyFetched); // 問題読込済か
  const userAcFetchState = useSelector((state) => state.userAC.userAcFetchState, shallowEqual);
  const rivalAcFetchState = useSelector((state) => state.rivalAC.rivalAcFetchState, shallowEqual);
  const dispatch = useDispatch();

  // 関数==============================
  // https://github.com/kenkoooo/AtCoderProblems/blob/master/doc/api.md#submission-api
  // diff計算
  const calc_diff = (diff:number) => { // diff計算
    return (
      Math.round(
        diff >= 400 ? diff : 400 / Math.exp(1.0 - diff / 400)
      )
    )
  }
  // 問題データ取得=====
  const fetchProblemFromAPI = async () => { // apiから問題情報取得
    try{
      let url: string = "https://kenkoooo.com/atcoder/resources/merged-problems.json";
      const res = await axios.get(url);
      return (res.data);
    }catch(err){
      console.error(err);
    }
  }
  const reshapeProblemData = async (res: any) => { // arrに一時保存
    let arr: {[id: string]: problem_type} = {};
    res.map((problem_info: any) => (arr[problem_info.id]={
      ex_diff: false, 
      diff:-1, 
      solver:problem_info.solver_count, 
      contest_id:problem_info.contest_id, 
      problem_name:problem_info.title
    }));
    return arr;
  }
  const fetchEstimatedDiffFromAPI = async () => { // apiから推定diff取得
    try{
      let url: string = "https://kenkoooo.com/atcoder/resources/problem-models.json";
      const res = await axios.get(url);
      return (res.data);
    }catch(err){
      console.error(err);
    }
  }
  const addDiffToProblemData = async (p_arr: any, d_all: any) => { // arrにdiffの情報を追加
    Object.keys(d_all).map((key) => {
      if(p_arr[key]){
        if(d_all[key].difficulty){
          p_arr[key].ex_diff=true;
          p_arr[key].diff=calc_diff(d_all[key].difficulty);
        }
      }
    });
    
    return p_arr;
  }
  const storeProblemData = async (arr: any) => { // storeに保存
    dispatch(setAllProblem(arr));
    return arr;
  }
  const fetchAllProblems = async () => {
    const problem_all = await fetchProblemFromAPI(); // apiから問題情報取得
    const problem_arr = await reshapeProblemData(problem_all); // 必要な部分のみarrに一時保存
    await new Promise(s => setTimeout(s, 1000)); // 1sec待機
    const diff_all = await fetchEstimatedDiffFromAPI(); // apiから推定diff取得
    const diff_arr = await addDiffToProblemData(problem_arr,diff_all); // arrにdiffの情報を追加

    // ここの同期が取れていないかも
    const c = await storeProblemData(diff_arr); // storeに保存
    //console.log(c);
  }
  // コンテストデータ取得=====
  const fetchContestDataFromAPI = async () => { // apiからコンテスト情報取得
    try{
      let url: string = "https://kenkoooo.com/atcoder/resources/contests.json";
      const res = await axios.get(url);
      return (res.data);
    }catch(err){
      console.error(err);
    }
  }
  const reshapeContestData = async (res: any) => { // arrに一時保存
    let arr: {[id: string]: contest_type} = {};
    res.map((contest_info: any) => (arr[contest_info.id]={
      start_epoch: contest_info.start_epoch_second,
      title: contest_info.title}));
    return arr;
  }
  const storeContestData = async (arr: any) => { // storeに保存
    dispatch(setAllContest(arr));
    return arr;
  }
  const fetchContestData = async () => {
    const contest_all = await fetchContestDataFromAPI(); // apiからコンテスト情報取得
    const contest_arr = await reshapeContestData(contest_all); // 必要な部分のみarrに一時保存
    const c = await storeContestData(contest_arr); // storeに保存
  }
  // Problem,Contestの取得を合わせたもの=====
  const fetchProblemContestData = async() => {
    if(alreadyFetched) return;
    await fetchAllProblems();
    await new Promise(s => setTimeout(s, 1000)); // 1sec待機
    await fetchContestData();
    dispatch(setAlreadyFetched(true)); // 1度読んだ事を記録する
  }

  // ユーザーorライバルのAC履歴取得
  const fetch500Submissions = async (user_name: string, unix_sec: number) => {
    let url: string = "https://kenkoooo.com/atcoder/atcoder-api/v3/user/submissions";
    url += "?user=" + user_name;
    url += "&from_second=" + String(unix_sec);
    try{
      const res = await axios.get(url);
      //console.log(res.data);
      return (res.data);
    }catch(err){
      console.error(err);
    }
  }
  const fetchAllSubmissions = async (user_name: string) => {
    const arr: submission_type[] = [];
    let fromSecond: number = 0;
    let AC_all: submission_type[];
    while(1){
      AC_all = await fetch500Submissions(user_name,fromSecond);
      arr.push(...AC_all);
      arr.sort((a, b) => a.id - b.id);
      if(AC_all.length<500) break;
      fromSecond = arr[arr.length - 1].epoch_second + 1;
      await new Promise(s => setTimeout(s, 1000)); // 1sec待機
    }
    return arr;
  }
  const reshapeAcData = async (res: any) => { // arrに一時保存
    let arr: {[id: string]: number} = {};
    res.map((AC_info: any) => {
      const key:string=AC_info.problem_id;
      if(AC_info.result==="AC")
      if(key in arr){
        if(arr[key]<AC_info.epoch_second){
          arr[key]=AC_info.epoch_second;
        }
      }else{
        arr[key]=AC_info.epoch_second;
      }
    });
    return arr;
  }
  const storeAcData = async (arr: any, target: string) => { // storeに保存
    if(target==="user") dispatch(setUserAcHistory(arr));
    else dispatch(setRivalAcHistory(arr));
    return arr;
  }
  /*
  const getState = (target: string) => {
    let res: number = 0;
    if(target==="user"){
      res=userAcFetchState;
    }else{
      res=rivalAcFetchState;
    }
    return res;
  }
  */
  const fetchAcData = async (user_name: string, target: string) => {
    const AC_all = await fetchAllSubmissions(user_name); // apiから問題情報取得
    const AC_arr = await reshapeAcData(AC_all); // 必要な部分のみarrに一時保存
    // ここの同期が取れていないかも
    const c = await storeAcData(AC_arr,target); // storeに保存

    // 読み込み完了にする
    if(target==="user") dispatch(setUserAcFetchState(3));
    else dispatch(setRivalAcFetchState(3));
  }

  // ユーザーorライバルのレート取得
  const fetchRateInfo = async (user_name: string) => {
    let url: string = "https://kyopro-ratings.herokuapp.com/json?atcoder=";
    url += user_name;
    try{
      const res = await axios.get(url);
      //console.log(res.data);
      return (res.data.atcoder);
    }catch(err){
      console.error(err);
    }
  }
  const setRateToStore = async (arr: any, target: string) => { // storeに保存
    // 取得出来なかった場合は強制的に黒にする
    if(arr.status==='error'){
      arr.color='black';
      arr.rating=0;
    }
    
    if(target==="user") dispatch(setUserRate(arr));
    else dispatch(setRivalRate(arr));
    return arr;
  }
  const fetchUserRate = async (user_name: string, target: string) => {
    const Rate_all = await fetchRateInfo(user_name); // apiから問題情報取得
    // ここの同期が取れていないかも
    const c = await setRateToStore(Rate_all,target); // storeに保存
    //console.log(c);
  }

  return { fetchProblemContestData, fetchAcData, fetchUserRate }
}

// 提出件数
//https://kenkoooo.com/atcoder/atcoder-api/v3/user/submission_count?user=bird01&from_second=1560046356&to_second=1655222000

// 推定diff
// https://kenkoooo.com/atcoder/resources/problem-models.json