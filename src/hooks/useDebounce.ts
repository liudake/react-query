import { useEffect, useCallback, useRef } from "react";

interface Debounce {
  fn: any;
  timer: null | NodeJS.Timeout;
}
const _this = this;
//1. 在react hooks里面每次组件重新渲染，都会执行一遍所有的hooks，这样debounce高阶函数里面的timer就不能起到缓存的作用（每次重渲染都被置空）
//2. 想要得到正确的运行结果，必须以某种方式存储那些本会被删除的变量和方法的引用。
//3. 所以利用React组件的缓存机制，通过自定义Hook useCallback 组件去解决这个问题
function useDebounce(fn, delay) {
  // useRef 快照，存储被删除的变量和方法的引用
  const res = useRef({ fn, timer: null });
  const current = res.current as Debounce;

  useEffect(() => {
    current.fn = fn;
  }, [current, fn]);
  // useCallback 缓存里面的函数
  return useCallback(
    function f(...args) {
      if (current.timer) {
        clearTimeout(current.timer);
      }
      current.timer = setTimeout(() => {
        current.fn.call(_this, ...args);
      }, delay);
    },
    [current, delay]
  );
}

export default useDebounce;
