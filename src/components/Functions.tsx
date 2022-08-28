import { SSpanUser,SSpanMetalUser,SSpan,SSpanMetal,SSpanSideSpace } from "../css/CommonCSS";

// min以上max未満の乱数を返す
export const getRandomInt = (min:number ,max:number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}
/*
function getRandomInt(min:number ,max:number){
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}
*/
// 指定要素数の順列をシャッフルしたものを返す(Fisher-Yates shuffle)
export const shuffledPermutation = (p_num: number) => {
  const arr=[...Array(p_num)].map((_, i) => i);
  for(let i=arr.length-1; i>0; --i){
    const r=Math.floor(Math.random()*(i+1));
    const tmp=arr[i];
    arr[i]=arr[r];
    arr[r]=tmp;
  }
  return arr;
}
// 指定した数までの重複なしのランダムな数字を10個返す
export const randNums = (mx_idx:number) => {
  const arr:number[]=[];
  for(let i=0; i<10; ++i){
    while(true){
      const tmp = getRandomInt(0,mx_idx);
      if(!arr.includes(tmp)){
        arr.push(tmp);
        break;
      }
    }
  }
  return arr;
}
// diffからcolorを作成
export const diffToColor = (diff:number) => {
  let color: string = '#FFFFFF';
  if(diff<400) color = '#808080';
  else if(diff<800) color = '#804000';
  else if(diff<1200) color = '#008000';
  else if(diff<1600) color = '#00C0C0';
  else if(diff<2000) color = '#0000FF';
  else if(diff<2400) color = '#C0C000';
  else if(diff<2800) color = '#FF8000';
  else if(diff<3200) color = '#FF0000';
  else color = '#FF0000';
  return color;
};
// solvers→レアリティの変換
export const solversToRarity = (solvers:number) => {
  let res="N";
  if(solvers<=300) res="SSR";
  else if(solvers<=1000) res="SR"
  else if(solvers<=2000) res="R"
  return res;
}
// Diffマーク(ユーザー)
export const diff_mark_user = (diff:number) => {
  if(diff<3200){
    const color:string = diff===0?"#000000":diffToColor(diff);
    const ratio:number = (diff%400)/4;
    return <SSpanUser rate_c={color} ratio={ratio}/>
  }else{
    let type:string="gold";
    if(diff<3600) type="bronz";
    else if(diff<4000) type="silver";
    return <SSpanMetalUser type={type}/>
  }
}
// Diffマーク(問題)
export const diff_mark = (diff:number) => {
  if(diff===-1){
    return <SSpanSideSpace>?</SSpanSideSpace>
  }else{
    if(diff<3200){
      const color:string = diffToColor(diff);
      const ratio:number = (diff%400)/4;
      return <SSpan rate_c={color} ratio={ratio}/>
    }else{
      let type:string="gold";
      if(diff<3600) type="bronz";
      else if(diff<4000) type="silver";
      return <SSpanMetal type={type}/>
    }
  }
}
// ツールチップの表示内容(レアリティ条件)
export const description_RarityToSolvers = (solvers:number) => {
  if(solvers<300) return (<>{"Solvers: 0-299"}</>)
  else if(solvers<1000) return (<>{"Solvers: 300-999"}</>)
  else if(solvers<2000) return (<>{"Solvers: 1000-1999"}</>)
  else return (<>{"Solvers: 2000-INF"}</>)
}
// ツールチップの表示内容(Difficulty)
export const description_diff = (diff:number) => {
  let diff_str:string = '-';
  if(diff!=-1) diff_str = String(diff);
  return (
    <>Difficulty: {diff_str}</>
  )
}
// エポック秒→日付の変換
export const epocToDate = (u_sec:number) => {
  if(u_sec==0) return "-";
  const date:Date=new Date(u_sec*1000);
  const year:number=date.getFullYear();
  const month:string=('0'+(date.getMonth()+1)).slice(-2);
  const day:string=('0'+date.getDate()).slice(-2);
  const date_str:string=(year+'-'+month+'-'+day);
  return date_str;
}