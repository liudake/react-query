import React, { useState } from "react";
import { getInfoQq } from "./api/qq";
import useDebounce from "./hooks/useDebounce";
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [msg, setMsg] = useState("");
  const [val, setVal] = useState("");
  const [info, setInfo] = useState(DEFAULT_INFO);
  // 利用防抖函数进行优化查询接口，详细情况请看useDebounce接口说明
  const delayedVal = useDebounce((q) => sendVal(q), DELAY);
  const inputChange = (e) => {
    const val = e.target.value;
    setVal(val);
    delayedVal(val);
  };

  async function sendVal(val) {
    setLoading(true);
    setError(false);
    try {
      const res = await getInfoQq(val) as IInfoQqRes;
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
    setLoading(false);
  }
  function handleFail(msg) {
    setError(true);
    setMsg(msg);
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
        {loading && <div className="App-loading">加载中...</div>}
        {!loading && info.qq && (
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
        {error && <div className="App-error">{msg}</div>}
      </div>
    </div>
  );
}

export default App;
