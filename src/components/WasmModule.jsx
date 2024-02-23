import React, { useEffect } from "react";

let wasmModule = null;

export const loadWasmModule = async () => {
  if (!wasmModule) {
    try {
      // 모듈 로드
      const importObject = {
        wasi_snapshot_preview1: {
          proc_exit: () => {},
          fd_close: () => {},
          fd_write: () => {},
          fd_seek: () => {},
        },
      };

      const response = await fetch("/test.wasm");
      console.log("jjy response", response);
      const buffer = await response.arrayBuffer();
      console.log("jjy buffer", buffer);
      const result = await WebAssembly.instantiate(buffer, importObject);

      wasmModule = result.instance.exports;
    } catch (e) {
      console.warn("jjy loadWasmModule error", e);
    }
  }

  return wasmModule;
};

const WasmModule = () => {
  useEffect(() => {
    const initializeWasm = async () => {
      try {
        const wasmModule = await loadWasmModule();
        const size = 5;
        const a = 2;
        const b = 3;
        console.log("jjy wasmModule", wasmModule);
        // const addFunc = wasmModule.add;
        const arrayFunc = wasmModule.array;
        // console.log("jjy addFunc", addFunc(a, b));

        const resultArrayPointer = arrayFunc(size, a, b);

        console.log("jjy arrayFunc", arrayFunc(size, a, b));
        const resultArray = new Int32Array(
          wasmModule.memory.buffer,
          resultArrayPointer,
          size
        );
        console.log("jjy arrayFunc", resultArray);
        // 메모리 해제
        // wasmModule._free(addFunc);
        wasmModule.free(arrayFunc);
        return wasmModule;
      } catch (e) {
        console.log("jjy initializeWasm error", e);
      }
    };
    console.log("jjy ?", initializeWasm());
  }, []);

  return (
    <div>
      <h3>C to WASM Duration time</h3>
      {/* <p>c = {cTime}</p>
      <p>js = {jsTime}</p>
      <p>js / c = {jsTime / cTime}</p> */}
    </div>
  );
};

export default WasmModule;
