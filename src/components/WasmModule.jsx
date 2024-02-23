import React, { useEffect, useMemo, useState } from "react";
import wasmModuleFile from "../wasm/wasmModule.wasm";

const size = 100000;
const timeset = 20;

const loadWasmModule = async () => {
  try {
    const importObject = {
      wasi_snapshot_preview1: {
        proc_exit: () => {},
        fd_close: () => {},
        fd_write: () => {},
        fd_seek: () => {},
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

const WasmModule = () => {
  const [module, setModule] = useState();

  const cTime = useMemo(() => {
    if (module) {
      const time = [];
      const arrayFunc = module.array;

      for (let i = 0; i < timeset; i++) {
        const startTime = performance.now();

        const resultPtr = arrayFunc(size, 2, 3);
        // console.log("jjy resultPtr c", resultPtr);
        const dataArray = new Int32Array(module.memory.buffer, resultPtr, size);
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
      module.free(arrayFunc);
    }
  }, [module, timeset]);

  const jsTime = useMemo(() => {
    const time = [];

    for (let i = 0; i < timeset; i++) {
      const startTime = performance.now();
      const obj = [];
      for (let i = 0; i < size; i++) {
        obj.push(2 * 3 * i);
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

  useEffect(() => {
    const initializeWasm = async () => {
      const wasmModule = await loadWasmModule();
      setModule(wasmModule);
    };
    initializeWasm();
  }, []);

  return (
    <div>
      <h3>C to WASM Duration time</h3>
      <p>c = {cTime}</p>
      <p>js = {jsTime}</p>
      <p>js / c = {jsTime / cTime}</p>
    </div>
  );
};

export default WasmModule;
