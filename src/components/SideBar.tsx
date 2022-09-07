import useMedia from "use-media";
//import { useParams } from "react-router-dom";
import { useNavigate, createSearchParams, useSearchParams } from "react-router-dom";
// CSS
import styled from "@emotion/styled";
import { SDivDisableBgcol } from '../css/CommonCSS';
import { SDivNowrap, SSpanInlineBlock, SDivDisableText } from '../css/CommonCSS';
// Redux
import { useSelector } from '../store/store';
import { useDispatch, shallowEqual } from 'react-redux';
import { setGachaDisplay } from '../store/displaySlice';
import { setCandidateProblem } from '../store/candidateProblemSlice';
import { setUserID, setFetchedUserID, setUserRate } from '../store/userInfoSlice';
import { setRivalID, setFetchedRivalID, setRivalRate } from '../store/rivalInfoSlice';
import { setGachaType, setDiff } from '../store/settingInfoSlice';
import { setPeriod } from '../store/settingInfoSlice';
import { setUserAcHistory, setUserAcFetchState } from '../store/userAcSlice';
import { setRivalAcHistory, setRivalAcFetchState } from '../store/rivalAcSlice';

// ビルトインフック
import { useState, useEffect ,memo, useCallback} from 'react';
// Custom Hooks
import { useFetchAtcoder } from '../hooks/useFetchData';
// Material UI
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
// 外部コンポーネント
import { GachaTypeSetting } from './GachaSetting/GachaTypeSetting';
import { DiffSetting } from './GachaSetting/DiffSetting';
import { PeriodSetting } from './GachaSetting/PeriodSetting';
import type { problem_type, rate_type } from "../types/typeFormat";
import { diff_mark_user } from "./Functions";

export const SideBar = memo((props:any) => {
  //const { userID_rivalID } = useParams();
  const {isWide} = props;
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const disp_param = searchParams.get("disp");
  const uid_param = searchParams.get("uid");
  const rid_param = searchParams.get("rid");
  const type_param = searchParams.get("type");
  const diff_param = searchParams.get("diff");
  const period_param = searchParams.get("period");
  //disp=disp&id=user%252Cuser&type=type&diff=diff&period=0
  //const isWide = useMedia({ minWidth: "1000px" });
  // 型定義==============================
  interface Problem_list {
    [index: string]: problem_type
  }
  interface ID_Time {
    id: string,
    time: number,
  }
  /*
  const problems: Problem_list = {};
  problems['p0']={lastAC:0,diff:0,solver:0};
  problems['p1']={lastAC:1,diff:1,solver:1};
  const userAC = new Set(['p0','p1']);
  const res = new Array([...userAC].filter(e => (problems[e].diff>=0)));
  console.log(res[0][0]);
  */
  // カスタムフック==============================
  const { fetchProblemContestData, fetchAcData, fetchUserRate } = useFetchAtcoder();

  // State==============================
  const [notUserAc,set_notUserAc] = useState<string[]>([]);
  const [onlyRivalAc,set_onlyRivalAc] = useState<string[]>([]);
  
  // Redux==============================
  const allProblem = useSelector((state) => state.problem.allProblem, shallowEqual);
  const allContest = useSelector((state) => state.contest.allContest, shallowEqual);
  const alreadyFetched = useSelector((state) => state.problem.alreadyFetched, shallowEqual); // 問題読込済か
  const candidateProblem = useSelector((state) => state.c_problem.candidateProblem, shallowEqual);
  const userAcHistory = useSelector((state) => state.userAC.userAcHistory, shallowEqual);
  const userAcFetchState = useSelector((state) => state.userAC.userAcFetchState, shallowEqual);
  const rivalAcHistory = useSelector((state) => state.rivalAC.rivalAcHistory, shallowEqual);
  const rivalAcFetchState = useSelector((state) => state.rivalAC.rivalAcFetchState, shallowEqual);
  const userID = useSelector((state) => state.user.userID, shallowEqual);
  const fetchedUserID = useSelector((state) => state.user.fetchedUserID, shallowEqual);
  const rivalID = useSelector((state) => state.rival.rivalID, shallowEqual);
  const fetchedRivalID = useSelector((state) => state.rival.fetchedRivalID, shallowEqual);
  const userRate = useSelector((state) => state.user.userRate, shallowEqual);
  const rivalRate = useSelector((state) => state.rival.rivalRate, shallowEqual);
  const gachaDisplay = useSelector(state => state.display.gachaDisplay, shallowEqual);
  const gachaType = useSelector((state) => state.setting.gachaType, shallowEqual);
  const settedDiff = useSelector((state) => state.setting.diff, shallowEqual);
  const period = useSelector((state) => state.setting.period, shallowEqual);
  //const userAC = useSelector((state) => state.user.userAC, shallowEqual);
  const dispatch = useDispatch();
  
  // color==============================
  //const cyan="#00C0C0";
  const rate_c=userRate.color;//rate.color;
  const rate_c_rival=rivalRate.color;//rateRival.color;
  const ratio=(userRate.rating%400)/4;//(rate.rating%400)/4;
  const ratio_rival=(rivalRate.rating%400)/4;//(rateRival.rating%400)/4;

  // Styled CSS==============================
  const SDivCoverOuter = styled.div`
    width: 100%;//fit-content;
    //height: fit-content;
    //height: 150px;
    position: relative;
    //display: flex;
    //flex-flow: column;
    //align-items: normal;
  `
  const SDivCoverOuterPeriod = styled.div`
    width: 100%;//fit-content;
    height: 115px;
    position: relative;
  `
  const SDivCoverInner = styled.div`
    display: table;
    position: absolute;
    width: 100%;
    height: 100%;
    //height: calc(100% + 10px);
    //height: -webkit-fill-available;
    top: -5px;
    //bottom: 0px;
    left: 0px;
    text-align: center;
    background-color: rgba(0,0,0,0.7);
    ${gachaType==="既AC"?"display:none;":""}
  `
  const SDivText = styled.div`
    //height: 50px;
    //position: absolute;
    //top: 0;
    //bottom: 0;
    color: white;
    display: table-cell;
    vertical-align: middle;
  `
  // 以下3つは下にあると不具合があるためここに移動
  const SDivDirection = styled.div`
    display: flex;
    flex-direction: row;
  `;
  const SDivFlexItem = styled.div`
    width: 100%;
  `;
  const SDivFlexItemLLine = styled.div`
    width: 100%;
    margin-left: 5px;
    border-left: 1px solid #a9b4be;
  `;

  // 関数==============================
  // unix時間の計算
  const calcUnixTime = (t_param:number[]) => {
    //今日の0時0分0秒を求める
    const now = new Date();
    let date = new Date(now.getFullYear()-t_param[0],now.getMonth()-t_param[1],now.getDate()-t_param[2]*7-t_param[3],0,0,0);
    const u_time=Math.floor(date.getTime()/1000);
    return u_time;
  }
  // インデックスからy,m,w,dのパラメータを求める
  const getTimeParam = (type:number) => {
    let arr:number[] = [];
    if(type===0){
      arr[0]=50,arr[1]=0,arr[2]=0,arr[3]=0;
    }else if(type===1){
      arr[0]=1,arr[1]=0,arr[2]=0,arr[3]=0;
    }else if(type===2){
      arr[0]=0,arr[1]=6,arr[2]=0,arr[3]=0;
    }else if(type===3){
      arr[0]=0,arr[1]=3,arr[2]=0,arr[3]=0;
    }else if(type===4){
      arr[0]=0,arr[1]=1,arr[2]=0,arr[3]=0;
    }else if(type===5){
      arr[0]=0,arr[1]=0,arr[2]=2,arr[3]=0;
    }else if(type===6){
      arr[0]=0,arr[1]=0,arr[2]=1,arr[3]=0;
    }else if(type===7){
      arr[0]=0,arr[1]=0,arr[2]=0,arr[3]=0;
    }
    return arr;
  }
  const isNumeric = (val:string) => {
    return /^-?\d+$/.test(val);
  }
  // 候補の問題を選ぶ
  const selectCandidate = () => {
    let key_arr:string[] = [];

    if(gachaType==="未AC"){
      key_arr = notUserAc;

    }else if(gachaType==="既AC"){
      const fromTime=calcUnixTime(getTimeParam(period[0]));
      const toTime=calcUnixTime(getTimeParam(period[1]));
      // 既ACの中から期間を満たすものを抽出
      key_arr = new Array(Object.keys(userAcHistory).filter((e:any) => (fromTime<userAcHistory[e] && userAcHistory[e]<toTime)))[0];

    }else if(gachaType==="ライバル"){
      key_arr = onlyRivalAc;

    }else{
      // 全問題
      key_arr = Object.keys(allProblem);
      
    }
    
    let l=-1, r=10000;
    switch(settedDiff){
      case "全?":
        l=-1; r=10000; break;
      case "全":
        l=0; r=10000; break;
      case "灰":
        l=0; r=400; break;
      case "茶":
        l=400; r=800; break;
      case "緑":
        l=800; r=1200; break;
      case "水":
        l=1200; r=1600; break;
      case "青":
        l=1600; r=2000; break;
      case "黄":
        l=2000; r=2400; break;
      case "橙":
        l=2400; r=2800; break;
      case "赤":
        l=2800; r=3200; break;
      case "銅":
        l=3200; r=3600; break;
      case "銀":
        l=3600; r=4000; break;
      case "金":
        l=4000; r=10000; break;
      default:
        l=-1; r=10000;
    }
    const filtered = new Array(key_arr.filter((e:any) => (l<=allProblem[e].diff && allProblem[e].diff<r)));
    //dispatch(setCandidateProblem(filtered[0])); // ソートなしの格納

    // id,timeのオブジェクトの配列を作成
    const id_time: Array<ID_Time> = [];
    filtered[0].map((id:string) => {
      let epoc: number = 0;
      if(allContest[allProblem[id].contest_id]) epoc = allContest[allProblem[id].contest_id].start_epoch;
      const buf: ID_Time = {
        id: id,
        time: epoc,
      };
      id_time.push(buf);
    });
    // time,idの優先度でソート
    id_time.sort(
      (O1: ID_Time, O2: ID_Time) => {
        if(O1.time < O2.time) return 1;
        if(O1.time > O2.time) return -1;

        if(O1.id > O2.id) return 1;
        return -1;
      }
    );
    // idのみで配列を作り直す
    const sorted_filtered_ids: Array<string> = [];
    id_time.map((e:ID_Time) => {
      sorted_filtered_ids.push(e.id);
    });

    dispatch(setCandidateProblem(sorted_filtered_ids));
  }
  // ガチャタイプの変更時に登録する
  const onChangeGachaType: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
    dispatch(setGachaType(e.target.value));
  }
  // 画面サイズ変更時に選択中のガチャタイプを表示する
  /*
  const setCurrentType = () => {
    let element = document.getElementById("gachaTypeSelect") as HTMLSelectElement;
    let options = element.options;
    if(gachaType==="全部") options[0].selected=true;
    else if(gachaType==="既AC") options[1].selected=true;
    else if(gachaType==="未AC") options[2].selected=true;
    else if(gachaType==="ライバル") options[3].selected=true;
  };
  */
  // 検索条件diffの変更時に登録する
  const onChangeDiffSetting: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
    dispatch(setDiff(e.target.value));
  }
  // 画面サイズ変更時に選択中のdiffを表示する
  /*
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
  */

  const entered_userID = (input_userID:string) => {
    //fetchUserRate(input_userID,"user");
    //fetchAcData(input_userID,"user");
    //dispatch(setUserAcFetchState(1));
    dispatch(setUserID(input_userID));
  }
  const entered_rivalID = (input_rivalID:string) => {
    //fetchUserRate(input_rivalID,"rival");
    //fetchAcData(input_rivalID,"rival");
    //dispatch(setRivalAcFetchState(1));
    dispatch(setRivalID(input_rivalID));
  }
  const selected_gachaType = (cuType: string) => {
    dispatch(setGachaType(cuType));
  }
  const gachaType_str_to_idx = (str:string) => {
    if(str==="全部") return 0;
    else if(str==="既AC") return 1;
    else if(str==="未AC") return 2;
    else if(str==="ライバル") return 3;
    return 0;
  }
  const gachaType_idx_to_str = (idx:number) => {
    if(idx===0) return "全部";
    else if(idx===1) return "既AC";
    else if(idx===2) return "未AC";
    else if(idx===3) return "ライバル";
    return "全部";
  }
  const settedDiff_str_to_idx = (str:string) => {
    if(str==="全?") return 0;
    else if(str==="全") return 1;
    else if(str==="灰") return 2;
    else if(str==="茶") return 3;
    else if(str==="緑") return 4;
    else if(str==="水") return 5;
    else if(str==="青") return 6;
    else if(str==="黄") return 7;
    else if(str==="橙") return 8;
    else if(str==="赤") return 9;
    else if(str==="銅") return 10;
    else if(str==="銀") return 11;
    else if(str==="金") return 12;
    return 1;
  }
  const settedDiff_idx_to_str = (idx:number) => {
    if(idx===0) return "全?";
    else if(idx===1) return "全";
    else if(idx===2) return "灰";
    else if(idx===3) return "茶";
    else if(idx===4) return "緑";
    else if(idx===5) return "水";
    else if(idx===6) return "青";
    else if(idx===7) return "黄";
    else if(idx===8) return "橙";
    else if(idx===9) return "赤";
    else if(idx===10) return "銅";
    else if(idx===11) return "銀";
    else if(idx===12) return "金";
    return "全";
  }
  // url変更
  const url_add = (_gDisp:string,_uID:string,_rID:string,_gType:number,_diff:number,s_period:number,e_period:number) => {
    // url上の現在の設定値を確認
    let path=location.pathname.slice(1); // 左1文字('/')を削除
    const buf:string[]=path.split('%2F');
    console.log(buf);
    // ここがうまくいっていない
    // 現在のままにするものを上書き
    if(buf[0]!=null) if(_gDisp==='') _gDisp=buf[0];
    if(buf[1]!=null){
      const names=buf[1].split('%2C');
      if(_uID==='') if(names[0]!=null) _uID=names[0];
      if(_rID==='') if(names[1]!=null) _rID=names[1];
    }
    if(buf[2]!=null) if(_gType===-1) _gType=Number(buf[3]);
    if(buf[3]!=null) if(_diff===-1) _diff=Number(buf[4]);
    if(buf[4]!=null){
      const periods=buf[4].split('_');
      if(periods[0]!=null) if(s_period===-1) s_period=Number(periods[0]);
      if(periods[1]!=null) if(e_period===-1) e_period=Number(periods[1]);
    }

    // 画面,ユーザー,タイプ,Diff,Period
    let url:string = "/";
    url+=_gDisp;
    url+='%2F'+_uID+"%2C"+_rID;
    url+='%2F'+_gType;
    url+='%2F'+_diff;
    url+='%2F'+s_period+'_'+e_period;

    let url0:string = "/";
    url0+='gacha';
    url0+='%2F'+"%2C";
    url0+='%2F'+'0';
    url0+='%2F'+'1';
    url0+='%2F'+'0_7';
    url0+='dummy';

    //if(url!=url0 && url!=location.pathname) history.replaceState('','',url);
    /*
    if(url!=""){
      //history.pushState('','',url);
      history.replaceState('','',url);
    }
    */
  }
  // 状態変化をurlに反映する
  const url_add2 = (_gDisp:string,_uID:string,_rID:string,_gType:number,_diff:number,_period:string) => {
    if(_gDisp===''){
      if(disp_param!=null) _gDisp=disp_param;
      else _gDisp='gacha';
    }
    if(_uID===''){
      if(uid_param!=null) _uID=uid_param;
      else _uID='';
    }
    if(_rID===''){
      if(rid_param!=null) _rID=rid_param;
      else _rID='';
    }
    if(_gType===-1){
      if(type_param!=null) _gType=Number(type_param);
      else _gType=0;
    }
    if(_diff===-1){
      if(diff_param!=null) _diff=Number(diff_param);
      else _diff=1;
    }
    if(_period===''){
      if(period_param!=null) _period=period_param;
      else _period='0_7';
    }

    let params = createSearchParams({
      disp: _gDisp,
      uid: _uID,
      rid: _rID,
      type: ''+_gType,
      diff: ''+_diff,
      period: _period,
    }).toString();
    console.log(params);
    
    if(params==='disp=gacha&uid=&rid=&type=0&diff=1&period=0_7'){
      if(disp_param==null && uid_param==null && rid_param==null && type_param==null && diff_param==null && period_param==null) params='';
    }
    navigate(`/?${params}`, { replace: false });
  }
  useEffect(() => {
    console.log(gachaDisplay);
    if(gachaDisplay!=null) url_add2(gachaDisplay,'','',-1,-1,'');
  },[gachaDisplay])
  useEffect(() => {
    console.log(userID);
    if(userID!=null) url_add2('',userID,'',-1,-1,'');
  },[userID])
  useEffect(() => {
    console.log(rivalID);
    if(rivalID!=null) url_add2('','',rivalID,-1,-1,'');
  },[rivalID])
  useEffect(() => {
    console.log(gachaType);
    if(gachaType!=null) url_add2('','','',gachaType_str_to_idx(gachaType),-1,'');
  },[gachaType])
  useEffect(() => {
    console.log(settedDiff);
    if(settedDiff!=null) url_add2('','','',-1,settedDiff_str_to_idx(settedDiff),'');
  },[settedDiff])
  useEffect(() => {
    console.log(period);
    if(period[0]!=null && period[1]!=null){
      url_add2('','','',-1,-1,period[0]+'_'+period[1]);
    }
  },[period])

  // urlから条件取り込み
  const contidion_read = () => {
    let path=location.pathname.slice(1); // 左1文字('/')を削除
    console.log(path);
    // デフォルトの条件
    let g_disp:string = 'gacha';
    let u_name:string = '';
    let r_name:string = '';
    let g_type:number = 0;
    let _diff:number = 1;
    let period_s:number = 0;
    let period_e:number = 7;

    // 条件を適正化して設定
    const buf:string[]=path.split('%2F');
    // 1.gacha/content
    if(buf[0]!=null){
      if(buf[0]==='content'){
        g_disp='content';
        dispatch(setGachaDisplay('content'));
      }
    }
    // 2.user_name
    if(buf[1]!=null){
      const names=buf[1].split('%2C');
      if(names[0]!=null && names[0]!="" && names[0]!=userID){u_name=names[0]; dispatch(setUserID(u_name));}
      if(names[1]!=null && names[1]!="" && names[1]!=rivalID){r_name=names[1]; dispatch(setRivalID(r_name));}
    }
    // 3.ガチャタイプ
    if(buf[2]!=null){
      let gacha_idx:number = 0;
      // 数値に変換可能な場合
      if(isNumeric(buf[2])){
        g_type=Number(buf[2]);
        if(gacha_idx<0 || 3<gacha_idx) gacha_idx=0;
        dispatch(setGachaType(gachaType_idx_to_str(gacha_idx)));
      }
    }
    // 4.Diff
    if(buf[3]!=null){
      // 数値に変換可能な場合
      if(isNumeric(buf[3])){
        _diff=Number(buf[3]);
        if(_diff<0 || 12<_diff) _diff=1;
        dispatch(setDiff(settedDiff_idx_to_str(_diff)));
        console.log(_diff);
        console.log(settedDiff_idx_to_str(_diff));
      }
    }
    // 5.Period
    if(buf[4]!=null){
      const periods=buf[4].split('_');
      if(periods[0]!=null && periods[1]!=null){
        // 数値に変換可能な場合
        if(isNumeric(periods[0]) && isNumeric(periods[1])){
          period_s=Number(periods[0]);
          period_e=Number(periods[1]);
          // 開始終了が正しい場合
          if(0<=period_s && period_e<=7 && period_s<period_e){
            dispatch(setPeriod([period_s,period_e]));
          }
        }
      }
    }

    url_add(g_disp,u_name,r_name,g_type,_diff,period_s,period_e);
  }
  // useEffect==============================
  useEffect(() => { // ページ読み込み時に一度だけ実行
    /*
    let path=location.pathname.slice(1); // 左1文字('/')を削除
    if(path!=''){
      const buf=path.split('%2C');
      if(buf.length<5){
        const url: string = "";
        url+="gacha";
        url+="user_name";
        url+=("%2F0"); // ガチャタイプ
        url+=("%2F1"); // Diff
        url+=("%2F0%2C7"); // Period
      }
      if(buf[0] && buf[0]!="" && buf[0]!=userID) dispatch(setUserID(buf[0]));
      if(buf[1] && buf[1]!="" && buf[1]!=rivalID) dispatch(setRivalID(buf[1]));
    }
    */
    /*
    if(userID_rivalID){
      const buf=userID_rivalID.split(',');
      if(buf[0] && buf[0]!="" && buf[0]!=userID) dispatch(setUserID(buf[0]));
      if(buf[1] && buf[1]!="" && buf[1]!=rivalID) dispatch(setRivalID(buf[1]));
    }
    */
    //contidion_read();
    //setCurrentType();
    //setCurrentDiff();

    // TODO:不正文字への対応
    if(disp_param!=null) dispatch(setGachaDisplay(disp_param));
    if(uid_param!=null) dispatch(setUserID(uid_param));
    if(rid_param!=null) dispatch(setRivalID(rid_param));
    if(type_param!=null) dispatch(setGachaType(gachaType_idx_to_str(Number(type_param)))); // 表示はまだ
    if(diff_param!=null) dispatch(setDiff(settedDiff_idx_to_str(Number(diff_param)))); // こっちは表示もされる
    if(period_param!=null){
      const buf=period_param.split('_');
      if(buf[0]!=null&&buf[1]!=null) dispatch(setPeriod([Number(buf[0]),Number(buf[1])]));
    }
    
    if(!alreadyFetched) fetchProblemContestData(); // 全問題、コンテスト読み込み
  }, []);
  /*
  useEffect(() => { // 問題読み込み完了時に一度だけ実行
    if(!alreadyFetched){
      dispatch(setCandidateProblem(allProblem)); // これは実行されていない気がする
    }
  }, [allProblem]);
  */
  useEffect(() => { // 候補問題の更新
    if(alreadyFetched) selectCandidate();
  }, [alreadyFetched,allProblem,allContest,userAcHistory,onlyRivalAc,gachaType,settedDiff,period]);
  useEffect(() => { // ユーザー未ACの作成(タイミングを工夫する必要あり)
    const key_arr:string[] = Object.keys(allProblem);
    const filtered = new Array(key_arr.filter((e:any) => (!userAcHistory[e])));
    set_notUserAc(filtered[0]);
  },[userAcHistory]);
  useEffect(() => { // ライバルAC済み、ユーザー未ACの作成
    const key_arr:string[] = Object.keys(rivalAcHistory);
    const filtered = new Array(key_arr.filter((e:any) => (!userAcHistory[e])));
    set_onlyRivalAc(filtered[0]);
  },[userAcHistory,rivalAcHistory]);

  useEffect(() => {
    if(userID!="" && userID!=fetchedUserID) dispatch(setUserAcFetchState(1));
    //url_add(gachaDisplay,userID,rivalID,gachaType_str_to_idx(gachaType),settedDiff_str_to_idx(settedDiff),period[0],period[1]);
    url_add('',userID,'',-1,-1,-1,-1);
    if(!userID || userID===""){ // userIDがなければAcHistory,Rateをリセット
      dispatch(setUserAcHistory({}));
      dispatch(setUserRate({color:"black", rating:0} as rate_type));
    }
  },[userID])
  useEffect(() => {
    if(rivalID!="" && rivalID!=fetchedRivalID) dispatch(setRivalAcFetchState(1));
    //url_add(gachaDisplay,userID,rivalID,gachaType_str_to_idx(gachaType),settedDiff_str_to_idx(settedDiff),period[0],period[1]);
    url_add('','',rivalID,-1,-1,-1,-1);
    if(!rivalID || rivalID===""){ // rivalIDがなければAcHistory,Rateをリセット
      dispatch(setRivalAcHistory({}));
      dispatch(setRivalRate({color:"black", rating:0} as rate_type));
    }
  },[rivalID])

  // rivalのAcFetch完了時にuserを取得したいかチェック
  useEffect(() => {
    if(userAcFetchState!=3){
      if(alreadyFetched && userAcFetchState===1 && rivalAcFetchState!=2){
        dispatch(setFetchedUserID(userID)); // 取得中,取得済みを記録して2重読み込みを防止
        dispatch(setUserAcFetchState(2));
        fetchAcData(userID,"user");
        fetchUserRate(userID,"user");
      }
    }
  },[alreadyFetched, userID, userAcFetchState, rivalAcFetchState]);
  // userのAcFetch完了時にrivalを取得したいかチェック
  useEffect(() => {
    if(rivalAcFetchState!=3){
      if(alreadyFetched && (userAcFetchState===0 || userAcFetchState===3) && rivalAcFetchState===1){
        dispatch(setFetchedRivalID(rivalID)); // 取得中,取得済みを記録して2重読み込みを防止
        dispatch(setRivalAcFetchState(2));
        fetchAcData(rivalID,"rival");
        fetchUserRate(rivalID,"rival");
      }
    }
    
  },[alreadyFetched, rivalID, userAcFetchState, rivalAcFetchState]);
  
  const anc_test = () => {
    console.log("anc");
    console.log(userAcFetchState);
    console.log(rivalAcFetchState);
    console.log(userID);
    console.log(rivalID);
  }
  // DOM==============================
  //<Box sx={{display:'flex'}}><CircularProgress /></Box>
  //console.log("SideBar");
  return (
    <>
      {/*
      {userID_rivalID}
      <button onClick={anc_test}>anc</button>
      */}

      {isWide?
      <SDivOuter>
        {/*<SDivNoMargin>Problems:{Object.keys(candidateProblem).length}</SDivNoMargin>*/}
        <SDivNoMargin>
          <Stack direction="row" alignItems="center">
          Problems:
            {!alreadyFetched ? <SDivDisableText>Fetching Problem Data</SDivDisableText>
            : <>{Object.keys(candidateProblem).length}</>}
          </Stack>
            
        </SDivNoMargin>
        <SHrNoPaddingT></SHrNoPaddingT>

        <Stack direction="row" alignItems="center">
          <SDivNowrap><SH4>User Info</SH4></SDivNowrap>
          {userAcFetchState===1 ? <SDivDisableText>Waiting...</SDivDisableText>
          :userAcFetchState===2 ? <SDivDisableText>Fetching Submission Data</SDivDisableText>
          : <></>}
        </Stack>
        <InputUserInfo name={userID} entered_userID={entered_userID} rate={userRate.rating} uniqueAC={Object.keys(userAcHistory).length}/>
        {/*
        <SH3>User Info</SH3>
        <SDivCoverOuter>
          <InputUserInfo name={userID} entered_userID={entered_userID} rate_c={rate_c} ratio={ratio} rate={userRate.rating} uniqueAC={Object.keys(userAcHistory).length}/>
          {userAcFetchState===0 || userAcFetchState===3?<></>:
          <SDivCoverInner>
            <SDivText>{userAcFetchState===1?"Waiting...":"Fetching Submission Data"}</SDivText>
          </SDivCoverInner>}
        </SDivCoverOuter>        
        */}

        <SHrNoPaddingT></SHrNoPaddingT>

        <Stack direction="row" alignItems="center">
          <SDivNowrap><SH4>Rival Info</SH4></SDivNowrap>
          {rivalAcFetchState===1 ? <SDivDisableText>Waiting...</SDivDisableText> 
          :rivalAcFetchState===2 ? <SDivDisableText>Fetching Submission Data</SDivDisableText> 
          : <></>}
        </Stack>
        <InputRivalInfo name={rivalID} entered_rivalID={entered_rivalID} rate={rivalRate.rating} uniqueAC={Object.keys(rivalAcHistory).length}/>
        {/*
        <SH3>Rival Info</SH3>
        <SDivCoverOuter>
          <InputRivalInfo name={rivalID} entered_rivalID={entered_rivalID} rate_c={rate_c_rival} ratio={ratio_rival} rate={rivalRate.rating} uniqueAC={Object.keys(rivalAcHistory).length}/>
          {rivalAcFetchState===0 || rivalAcFetchState===3?<></>:
          <SDivCoverInner>
            <SDivText>{rivalAcFetchState===1?"Waiting...":"Fetching Submission Data"}</SDivText>
          </SDivCoverInner>}
        </SDivCoverOuter>
        */}

        <SHrNoPaddingT></SHrNoPaddingT>
        <div>
          <SH4>Gacha Setting</SH4>
          {/*<SettingGachaType onChangeGachaType={onChangeGachaType}/>*/}
          <GachaTypeSetting onChangeGachaType={onChangeGachaType}/>
          <SHr></SHr>
          <DiffSetting onChangeDiffSetting={onChangeDiffSetting}/>
          <SHr></SHr>
          <PeriodSetting gachaType={gachaType}/>
          {/*
          <SDivDisableBgcol>
            <SDivCoverOuterPeriod>
              <PeriodSetting gachaType={gachaType}/>
              {
              gachaType==="既AC"?
              <></>
              :
              <SDivCoverInner>
                <SDivText>Valid only in userAC</SDivText>
              </SDivCoverInner>
              }
            </SDivCoverOuterPeriod>
          </SDivDisableBgcol>
          */}
          <SHrNoPaddingB></SHrNoPaddingB>
        </div>
      </SDivOuter>

      :
      <SDivOuter>
        <Stack direction="row" alignItems="center">
          Problems:
          {!alreadyFetched ? <SDivDisableText>Fetching Problem Data</SDivDisableText> 
          : <>{Object.keys(candidateProblem).length}</>}
        </Stack>

        {/*<div>Problems:{Object.keys(candidateProblem).length}</div>*/}
        <SHrNoPaddingT></SHrNoPaddingT>
        <SDivDirection>
          <SDivFlexItem>
            
            <Stack direction="row" alignItems="center">
              <SDivNowrap><SH4>User Info</SH4></SDivNowrap>
              {userAcFetchState===1 ? <SDivDisableText>Waiting...</SDivDisableText> 
              :userAcFetchState===2 ? <SDivDisableText>Fetching Submission Data</SDivDisableText> 
              : <></>}
            </Stack>
            <InputUserInfo name={userID} entered_userID={entered_userID} rate={userRate.rating} uniqueAC={Object.keys(userAcHistory).length}/>

            <SHrNoPaddingT></SHrNoPaddingT>

            <Stack direction="row" alignItems="center">
              <SDivNowrap><SH4>Rival Info</SH4></SDivNowrap>
              {rivalAcFetchState===1 ? <SDivDisableText>Waiting...</SDivDisableText> 
              :rivalAcFetchState===2 ? <SDivDisableText>Fetching Submission Data</SDivDisableText> 
              : <></>}
            </Stack>
            <InputRivalInfo name={rivalID} entered_rivalID={entered_rivalID} rate={rivalRate.rating} uniqueAC={Object.keys(rivalAcHistory).length}/>
            
          </SDivFlexItem>
          
          <SDivFlexItemLLine>
            <SDivPadding>
              <SH4>Gacha Setting</SH4>
              {/*<SettingGachaType onChangeGachaType={onChangeGachaType}/>*/}
              <GachaTypeSetting onChangeGachaType={onChangeGachaType}/>
              <SHr></SHr>
              <DiffSetting onChangeDiffSetting={onChangeDiffSetting}/>
              <SHr></SHr>
              <PeriodSetting gachaType={gachaType}/>
              {/*
              <SDivDisableBgcol>
                <SDivCoverOuterPeriod>
                  <PeriodSetting gachaType={gachaType}/>
                </SDivCoverOuterPeriod>
              </SDivDisableBgcol>
                */}
            </SDivPadding>
          </SDivFlexItemLLine>
        </SDivDirection>
        <SHrNoPaddingTB></SHrNoPaddingTB>
        

      </SDivOuter>
      }
    </>
  )

});

// Styled CSS==============================
const SDivOuter = styled.div`
  background-color:#f8f9fa;
  //border-bottom: 1px solid #a9b4be;
`;
const SH3 = styled.h3`
  margin-top:0;
  margin-bottom:0;
  text-decoration:underline;
`;
const SH4 = styled.h4`
  margin-top:0;
  margin-bottom:0;
  text-decoration:underline;
`;
const SDivPadding = styled.div`
  width: 100%;
  padding-left: 5px;
`;
const SDivNoMargin = styled.div`
//margin-top: 0px;
//margin-bottom:0px;
//padding: 0px;
`;
const SHr = styled.hr`
  border-style: none;
  border-top: 1px solid #a9b4be;
`;
const SHrNoPaddingTB = styled.hr`
  border-style: none;
  border-top: 1px solid #a9b4be;
  margin-top: 0px;
  margin-bottom:0px;
`;
const SHrNoPaddingT = styled.hr`
  border-style: none;
  border-top: 1px solid #a9b4be;
  margin-top: 0px;
`;
const SHrNoPaddingB = styled.hr`
  border-style: none;
  border-top: 1px solid #a9b4be;
  margin-bottom:0px;
`;
const SDivTop = styled.div`
  align: center;
`

// ユーザー名の入力
const InputUserInfo = memo((props:any) => {
  const {name,entered_userID,rate,uniqueAC} = props;

  // State==============================
  const [input_userID,set_input_userID] = useState(name);
  // Redux==============================
  //const dispatch = useDispatch();
  // Styled CSS==============================
  //<span style="display: inline-block; border-radius: 50%; border: solid 1px #00C0C0; background: -webkit-linear-gradient(bottom, #00C0C0 0%, #00C0C0 2.25%, #FFFFFF 2.25%, #FFFFFF 100%); height: 14px; width: 14px; vertical-align: center"></span>
  
  return (
    <>
      <Stack>
        <form>
          <input type="text" placeholder="User ID" value={input_userID} spellCheck="false"
          onChange={(event) => set_input_userID(event.target.value)}
          onKeyPress={(e) => {if(e.key == 'Enter'){e.preventDefault(); entered_userID(input_userID);}}} />
        </form>
        <div>Rate:{diff_mark_user(rate)}{rate}</div>
        <div>Unique AC:{uniqueAC}</div>
      </Stack>
    </>
  );
});

// ライバル名の入力
const InputRivalInfo = memo((props:any) => {
  const {name,entered_rivalID,rate,uniqueAC} = props;
  
  // State==============================
  const [input_rivalID,set_input_rivalID] = useState(name);
  // Redux==============================
  //const dispatch = useDispatch();
  // Styled CSS==============================

  return (
    <>
      <Stack>
        <form>
          <input type="text" placeholder="Rival ID" value={input_rivalID} spellCheck="false"
          onChange={(event) => set_input_rivalID(event.target.value)}
          onKeyPress={(e) => {if(e.key == 'Enter'){e.preventDefault(); entered_rivalID(input_rivalID);}}} />
        </form>
        <div>Rate:{diff_mark_user(rate)}{rate}</div>
        <div>Unique AC:{uniqueAC}</div>
      </Stack>
    </>
  );
});

// ガチャタイプ選択
const SettingGachaType = memo((props:any) => {
  const { onChangeGachaType } = props;
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
  );
});