import React, { useState } from "react";
import { getInfoQq } from "./api/qq";
import useDebounce from "./hooks/useDebounce";
import useAsync from "./hooks/useAsync";

import { IInfoQqBase, IInfoQqRes } from "./@types/qq";
import "./App.css";
const DELAY: number = 500;

const DEFAULT_INFO = {
  qq: "",
  code: -1,
  avatar: "",
  name: "",
} as IInfoQqBase;

function App() {
  const [val, setVal] = useState("");
  const [info, setInfo] = useState(DEFAULT_INFO);
  // 利用防抖函数进行优化查询接口，详细情况请看useDebounce接口说明
  const delayedVal = useDebounce((q) => sendVal(q), DELAY);
  
  const inputChange = (e) => {
    const val = e.target.value;
    setVal(val);
    delayedVal(val);
  };

  const state = useAsync(false, sendVal);

  async function sendVal(val) {
    try {
      const res = (await getInfoQq(val)) as IInfoQqRes;
      const { code = 1, name = "", qlogo = "", qq = "", msg = "" } = res || {};
      if (code === 1) {
        setInfo({
          qq,
          name,
          avatar: qlogo,
        });
      } else {
        throw new Error(msg);
      }
    } catch (error) {
      const { message = "" } = (error as { message: string }) || {};
      handleFail(message);
      console.log("DEBUG: sendVal => error", error);
    }
  }
  function handleFail(msg) {
    state.setFail(msg);
    setInfo(DEFAULT_INFO);
  }

  return (
    <div className="App">
      <div className="App-title">QQ号查询</div>
      <div className="App-form">
        <span>QQ</span>
        <input
          className="App-input"
          type="text"
          placeholder="请输入QQ号码"
          value={val}
          onChange={inputChange}
        />
      </div>
      <div className="App-content">
        {state.loading && <div className="App-loading">加载中...</div>}
        {!state.loading && info.qq && (
          <div className="App-info">
            <div className="App-info__left">
              <img src={info.avatar} className="avatar" alt="avatar" />
            </div>
            <div className="App-info__midd">
              <div className="name">{info.name}</div>
              <div className="id">{info.qq}</div>
            </div>
          </div>
        )}
        {state.error && <div className="App-error">{state.msg}</div>}
      </div>
    </div>
  );
}

export default App;
