import React from "react";
import WasmModule from "./components/WasmModule";

const data = { size: 100000, timeset: 20, a: 12, b: 13 };

function App() {
  return (
    <div className="App">
      <h2>Wasm Module Load Test</h2>
      {Object.keys(data).map((key, index) => (
        <div key={index}>
          <span>{key}: </span>
          <span>{data[key]}</span>
        </div>
      ))}
      <WasmModule data={data} />
    </div>
  );
}

export default App;
