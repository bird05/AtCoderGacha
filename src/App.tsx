import styled from "@emotion/styled";
//import * as wasm from "atcoder-gacha01";
import useMedia from "use-media";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// ビルトインフック
import { useState, memo} from 'react';
// 外部コンポーネント
import { SideBar } from './components/SideBar';
import { Gacha } from './components/Gacha';
import { GachaContentAll } from './components/GachaContentAll';
import { Main } from './components/Main';

// Redux
import { useSelector } from './store/store';
import { useDispatch } from "react-redux";

const App = memo(() => {
  //wasm.greet();
  const isWide = useMedia({ minWidth: "700px" });
  // Styled CSS==============================
  const SDivAll = styled.div`
    height: 100%;//vh;
    width: 100%;//vw;
    display: flex;
    flex-direction: ${isWide?"row":"column"};
  `
  const SDivSide = styled.div`
    ${isWide?"width: 180px":"height: 100%"};
    //padding-top: 5px;
    //padding-left: 5px;
    margin-top: 5px;
    margin-left: 5px;
    margin-right:5px;
    box-sizing: border-box;
    background-color: #ffffff;//blue;
  `
  const SDivMain = styled.div`
    height: ${isWide?"100vh":"100%"};
    width: 100%;
    padding: 5px;
    box-sizing: border-box;
    background-color: #ffffff;//green;
    border-left: 1px solid #333;
  `

  // DOM==============================
  //console.log("App");
  return (
    <>
      <BrowserRouter>
        <SDivAll>
          <SDivSide>
            <Routes>
              <Route path="/" element={<SideBar isWide={isWide}/>} />
              {/*<Route path="/:userID_rivalID" element={<SideBar isWide={isWide}/>} />*/}
              <Route path="/*" element={<SideBar isWide={isWide}/>} />
            </Routes>
            {/*<SideBar isWide={isWide}/>*/}
          </SDivSide>
          <SDivMain>
            <Main isWide={isWide}/>
          </SDivMain>
        </SDivAll>
      </BrowserRouter>
    </>
  );
});

export default App;
