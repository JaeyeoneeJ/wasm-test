import React from "react";
import WasmModule from "./components/WasmModule";

const data = { size: 300000, timeset: 10, a: 2016, b: 50817 };

function App() {
  return (
    <div className="App">
      <h2>Wasm Module Load Test</h2>
      <table>
        <tbody>
          {Object.keys(data).map((key, index) => (
            <tr key={index}>
              <td>{key}: </td>
              <td>{data[key]}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <WasmModule data={data} />
    </div>
  );
}

export default App;
