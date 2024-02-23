import React, { useEffect, useMemo, useState } from "react";
import createModule from "../wasm/add.mjs";

const size = 100000;
const timeset = 10;

const JsModule = () => {
  const [arrayFunc, setArrayFunc] = useState();
  const [module, setModule] = useState();

  // useEffect를 사용하여 웹어셈블리 모듈 비동기적으로 불러오기
  useEffect(() => {
    createModule().then((Module) => {
      // 웹어셈블리 모듈에서 'arrayFunc'함수를 가져와서 상태 업데이트
      setModule(Module);
      setArrayFunc(() =>
        Module.cwrap("array", "number", ["number", "number", "number"])
      );
    });
  }, []);

  const cTime = useMemo(() => {
    if (arrayFunc) {
      const time = [];
      for (let i = 0; i < timeset; i++) {
        const startTime = performance.now();

        const resultPtr = arrayFunc(size, 2, 2);
        // console.log("jjy resultPtr c", resultPtr);
        const dataArray = new Int32Array(
          module?.HEAP32.buffer,
          resultPtr,
          size
        );
        // console.log("jjy c dataArray", dataArray);

        const endTime = performance.now();
        const duringTime = endTime - startTime;

        time.push(duringTime);
        console.log("jjy c duringTime", duringTime);
      }

      if (time.length > 0) {
        const sum = time.reduce((acc, value) => acc + value, 0);
        const average = sum / time.length;
        console.log("jjy c time", time);
        console.log("jjy c average", sum / time.length);
        return average;
      }
    }
  }, [arrayFunc, module, timeset]);

  const jsTime = useMemo(() => {
    const time = [];

    for (let i = 0; i < timeset; i++) {
      const startTime = performance.now();
      const obj = [];
      for (let i = 0; i < size; i++) {
        obj.push(2 * 2 * i);
      }
      // console.log("jjy js dataArray", obj);
      const endTime = performance.now();
      const duringTime = endTime - startTime;
      time.push(duringTime);
      console.log("jjy js duringTime", duringTime);
    }
    if (time.length > 0) {
      const sum = time.reduce((acc, value) => acc + value, 0);
      console.log("jjy js time", time);
      console.log("jjy js average", sum / time.length);
      const average = sum / time.length;
      return average;
    }
  }, [timeset]);

  // 웹어셈블리 모듈이 로드되지 않았을 때 로딩 메세지 표시
  if (!arrayFunc) {
    return "Loading webassembly...";
  }

  return (
    <div className="App">
      <h3>C to JS Duration time</h3>
      <p>c = {cTime}</p>
      <p>js = {jsTime}</p>
      <p>js / c = {jsTime / cTime}</p>
    </div>
  );
};

export default JsModule;
