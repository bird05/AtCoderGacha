// CSS
import styled from "@emotion/styled";
// 外部コンポーネント
import { diffToColor } from "../components/Functions";

// 改行させない
export const SDivNowrap = styled.div`
  white-space: nowrap;
`
// 望ましい位置で改行させる
export const SSpanInlineBlock = styled.span`
display: inline-block;
`
// 使用不可の背景色
export const SDivDisableBgcol = styled.div`
  background-color:#f8f9fa; // 通常のSideBarの背景色
  //background-color: #a3afbc;
`
// 使用不可の文字
export const SDivDisableText = styled.div`
  font-size: 8px;
  line-height: 10px;
  color: #ff0000;
  //background-color: green;//#6c8297;
  padding-left: 5px;
`
// Diffマーク(ユーザー)
export const SSpanUser = styled.span<{
  rate_c: string;
  ratio: number;
}>`
display: inline-block;
border-radius: 50%;
border: solid 1px ${({ rate_c }) => rate_c };
background: -webkit-linear-gradient(bottom, ${({rate_c})=>rate_c} 0%, ${({rate_c})=>rate_c} ${({ratio})=>ratio}%, #FFFFFF ${({ratio})=>ratio}%, #FFFFFF 100%);
height: 12px;
width: 12px;
vertical-align: center;
`
// Diffマーク(ユーザー)(メタル)
export const SSpanMetalUser = styled.span<{
  type: string;
}>`
display: inline-block;
border-radius: 50%;
${({ type }) => (
  type==="bronz"?"border-color: rgb(150, 92, 44);background: linear-gradient(to right, rgb(150, 92, 44), rgb(255, 218, 189), rgb(150, 92, 44));":
  type==="silver"?"border-color: rgb(128, 128, 128);background: linear-gradient(to right, rgb(128, 128, 128), white, rgb(128, 128, 128));":
  "border-color: rgb(255, 215, 0);background: linear-gradient(to right, rgb(255, 215, 0), white, rgb(255, 215, 0));"
)}
height: 12px;
width: 12px;
vertical-align: center;
`
// Diffマーク(問題)
export const SSpan = styled.span<{
  rate_c: string;
  ratio: number;
}>`
display: inline-block;
border-radius: 50%;
border: solid 1px ${({ rate_c }) => rate_c };
background: -webkit-linear-gradient(bottom, ${({rate_c})=>rate_c} 0%, ${({rate_c})=>rate_c} ${({ratio})=>ratio}%, #FFFFFF ${({ratio})=>ratio}%, #FFFFFF 100%);
//background: -webkit-linear-gradient(bottom, ${({rate_c,ratio})=>(rate_c+" 0%, "+rate_c+" "+ratio+"%, #FFFFFF "+ratio)}%, #FFFFFF 100%);
margin-right: 5px;
height: 12px;
width: 12px;
vertical-align: center;
`
// Diffマーク(問題)(メタル)
export const SSpanMetal = styled.span<{
  type: string;
}>`
display: inline-block;
border-radius: 50%;
${({ type }) => (
  type==="bronz"?"border-color: rgb(150, 92, 44);background: linear-gradient(to right, rgb(150, 92, 44), rgb(255, 218, 189), rgb(150, 92, 44));":
  type==="silver"?"border-color: rgb(128, 128, 128);background: linear-gradient(to right, rgb(128, 128, 128), white, rgb(128, 128, 128));":
  "border-color: rgb(255, 215, 0);background: linear-gradient(to right, rgb(255, 215, 0), white, rgb(255, 215, 0));"
)}
margin-right: 5px;
height: 12px;
width: 12px;
vertical-align: center;
`
export const SSpanSideSpace = styled.span`
margin-left:6px;
margin-right:6px;
`
// リンクをDiffの色にする
export const SADiffColor = styled.a<{
  diff: number;
}>`
color: ${({ diff })=> diffToColor(diff) };
text-decoration: none;
&:hover {
  text-decoration: underline;
}
`
// リンクを薄めの青色にする
export const SALinkColor = styled.a`
color: #007BFF;
text-decoration: none;
&:hover {
  text-decoration: underline;
}
`
export const SDivNarrow = styled.div`
line-height: 12px;
`
// フレーム
export const SDivTitle = styled.div<{
  isWide: boolean;
  isMgnBtm: boolean;
}>`
border: 1px solid #333;
width: ${({ isWide }) => {return isWide?"calc(90vw - 180px)":"90vw"}};
margin-top: 3px;
margin-bottom: ${({ isMgnBtm }) => {return isMgnBtm?"3px":"0px"}};
margin-left: 3px;
margin-right: 3px;
font-size: 12px;
font-weight: bold;
background-color:white;
`
export const SDivFlame = styled.div<{
  rarity: string;
  isWide: boolean;
  isSeparated: boolean;
}>`
border: 1px solid #333;
${({ isSeparated }) => {if(!isSeparated) return "border-top: none"}};
width: ${({ isWide }) => {return isWide?"calc(90vw - 180px)":"90vw"}};
margin-top: ${({ isSeparated }) => {return isSeparated?"3px":"0px"}};
margin-bottom: ${({ isSeparated }) => {return isSeparated?"3px":"0px"}};
margin-left: 3px;
margin-right: 3px;
font-size: 12px;
${({ rarity }) => {
  const opacity:string = "0.25";
  if(rarity==="SSR") return "background: linear-gradient(90deg,rgba(255,97,97,"+opacity+"),rgba(233,178,45,"+opacity+") 20%,rgba(192,202,75,"+opacity+") 34%,rgba(53,179,56,"+opacity+") 58%,rgba(86,110,243,"+opacity+") 79%,rgba(154,39,238,"+opacity+"))"
  else if(rarity==="SR") return "background-color: rgba(255,255,0,"+opacity+")"; // 黄
  else if(rarity==="R") return "background-color: rgba(0,128,0,"+opacity+")"; // 緑
  else return "background-color: rgba(128,128,128,"+opacity+")"; // 灰
}};
`
export const SDivNoLine = styled.div<{
  isWide: boolean;
}>`
width: ${({ isWide }) => {return isWide?"calc((90vw - 180px)/6)":"calc(90vw/6)"}};
word-break: break-all;
padding: 5px;
`
export const SDivLLine = styled.div<{
  isWide: boolean;
}>`
width: ${({ isWide }) => {return isWide?"calc((90vw - 180px)/6)":"calc(90vw/6)"}};
word-break: break-all;
border-left: 1px solid #333;
padding: 5px;
`
