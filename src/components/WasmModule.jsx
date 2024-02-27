import React, { useEffect, useMemo, useState } from "react";
import "./WasmModule.css";
import wasmModuleFile from "../wasm/wasmModule.wasm";
import createModule from "../wasm/wasmModule.mjs";

const unitTime = " ms";
const unitMultiples = " 배";
const formatNum = (num) => {
  let convertNum = num;
  if (typeof convertNum !== "number") {
    convertNum = Number(num);
  }
  return convertNum.toFixed(4);
};

const loadWasmModule = async () => {
  try {
    const importObject = {
      wasi_snapshot_preview1: {
        proc_exit: () => {},
        fd_close: () => {},
        fd_write: () => {},
        fd_seek: () => {},
      },
      env: {
        emscripten_notify_memory_growth: () => {},
      },
    };

    const response = await fetch(wasmModuleFile);
    const buffer = await response.arrayBuffer();
    const result = await WebAssembly.instantiate(buffer, importObject);

    return result.instance.exports;
  } catch (e) {
    console.warn("loadWasmModule error", e);
  }
};

const WasmModule = ({
  debug = false,
  data = { size: 100000, timeset: 20, a: 20, b: 30 },
}) => {
  const [wasmModule, setWasmModule] = useState();
  const [module, setModule] = useState();
  const [arrayFunc, setArrayFunc] = useState();

  const cToJsTime = useMemo(() => {
    if (module && arrayFunc) {
      const time = [];
      for (let i = 0; i < data.timeset; i++) {
        const startTime = performance.now();

        const resultPtr = arrayFunc(data.size, data.a, data.b);
        // console.log("jjy resultPtr c", resultPtr);
        const dataArray = new Int32Array(
          module.HEAP32.buffer,
          resultPtr,
          data.size
        );
        debug && console.log("jjy cToJsTime dataArray", dataArray);
        module._free(resultPtr);

        const endTime = performance.now();
        const duringTime = endTime - startTime;

        time.push(duringTime);
      }

      if (time.length > 0) {
        const sum = time.reduce((acc, value) => acc + value, 0);
        const average = sum / time.length;
        return average;
      }
    }
  }, [arrayFunc, module, data, debug]);

  const cToWasmTime = useMemo(() => {
    if (wasmModule) {
      const time = [];
      const arrayFunc = wasmModule.array;

      for (let i = 0; i < data.timeset; i++) {
        const startTime = performance.now();

        const resultPtr = arrayFunc(data.size, data.a, data.b);
        // console.log("jjy resultPtr c", resultPtr);
        const dataArray = new Int32Array(
          wasmModule.memory.buffer,
          resultPtr,
          data.size
        );
        debug && console.log("jjy cToWasmTime dataArray", dataArray);
        wasmModule.free(resultPtr);

        const endTime = performance.now();
        const duringTime = endTime - startTime;

        time.push(duringTime);
      }

      if (time.length > 0) {
        const sum = time.reduce((acc, value) => acc + value, 0);
        const average = sum / time.length;
        return average;
      }
    }
  }, [wasmModule, data, debug]);

  const jsTime = useMemo(() => {
    const time = [];

    for (let i = 0; i < data.timeset; i++) {
      const startTime = performance.now();
      const obj = [];
      for (let i = 0; i < data.size; i++) {
        obj.push(2 * 3 * i);
      }
      debug && console.log("jjy js dataArray", obj);
      const endTime = performance.now();
      const duringTime = endTime - startTime;
      time.push(duringTime);
    }
    if (time.length > 0) {
      const sum = time.reduce((acc, value) => acc + value, 0);
      const average = sum / time.length;
      return average;
    }
  }, [data, debug]);

  useEffect(() => {
    const initializeWasm = async () => {
      const wasmModule = await loadWasmModule();
      setWasmModule(wasmModule);
    };
    initializeWasm();

    const initializeMjs = async () => {
      const mjsModule = await createModule();
      setModule(mjsModule);
      setArrayFunc(() =>
        mjsModule.cwrap("array", "number", ["number", "number", "number"])
      );
    };
    initializeMjs();
  }, []);

  return (
    <div>
      <h3>JS / WASM Duration time</h3>
      <table className={"table"}>
        <thead>
          <tr>
            <th>TYPE</th>
            <th>VALUE</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>C to JS</td>
            <td>{formatNum(cToJsTime) + unitTime}</td>
          </tr>
          <tr>
            <td>C to WASM</td>
            <td>{formatNum(cToWasmTime) + unitTime}</td>
          </tr>
          <tr>
            <td>JS</td>
            <td>{formatNum(jsTime) + unitTime}</td>
          </tr>
          <tr>
            <td>JS / C to JS</td>
            <td>{formatNum(jsTime / cToJsTime) + unitMultiples}</td>
          </tr>
          <tr>
            <td>JS / C to WASM</td>
            <td>{formatNum(jsTime / cToWasmTime) + unitMultiples}</td>
          </tr>
          <tr>
            <td>C to JS / C to WASM</td>
            <td>{formatNum(cToJsTime / cToWasmTime) + unitMultiples}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default WasmModule;
