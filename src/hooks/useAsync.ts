import { useState } from "react";

function useAsync(initialValue, fetchFunc) {
  const [loading, setLoading] = useState(initialValue);
  const [error, setError] = useState(initialValue);
  const [msg, setMsg] = useState("");
  const fetchList = async (...params) => {
    setLoading(true);
    setError(false);
    try {
      await fetchFunc(...params);
    } catch (err) {
      const { message = "" } = error || {};
      setFail(message);
      console.log("DEBUG: fetchList -> err", err);
    }
    setLoading(false);
    setError(false);
  };

  const setFail = (msg) => {
    setError(true);
    setMsg(msg);
  };

  return { fetchList, setFail: setFail, loading: loading, error: error, msg };
}

export default useAsync;
