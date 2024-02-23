import React from "react";
import WasmModule from "./components/WasmModule";

function App() {
  return (
    <div className="App">
      <h2>Wasm Module Load Test</h2>

      <WasmModule data={{ size: 100000, timeset: 20, a: 12, b: 13 }} />
    </div>
  );
}

export default App;
