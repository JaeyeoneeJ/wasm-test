import React, { useState } from "react";
import WasmModule from "./components/WasmModule";
import JsModule from "./components/JsModule";

function App() {
  const [selectMode, setSelectMode] = useState("JS");
  return (
    <div className="App">
      <h2>Wasm Module Load Test</h2>
      <button onClick={() => setSelectMode("JS")}>C to JS</button>
      <button onClick={() => setSelectMode("WASM")}>C to WASM</button>
      <div>{selectMode === "JS" ? <JsModule /> : <WasmModule />}</div>
    </div>
  );
}

export default App;
