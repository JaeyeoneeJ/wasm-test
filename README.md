# wasm-test

## 0. 개요

- 이 프로젝트는 React App에서 WebAssembly를 적용하고 순수 JavaScript와 WebAssembly로 컴파일한 모듈의 런타임 차이를 확인하기 위한 방법을 연구하기 위해 제작되었습니다.
- 해당 프로젝트의 수정은 아래 순서로 진행되었습니다. 아래 순서를 따라 프로젝트의 진행 순서를 확인 바랍니다.
  - [React App에서 WebAssembly 사용하기](https://github.com/JaeyeoneeJ/TIL/blob/main/react/React_App%EC%97%90%EC%84%9C_WebAssembly_%EC%82%AC%EC%9A%A9%ED%95%98%EA%B8%B0.md)
  - [브라우저에서 일반 자바스크립트와 웹어셈블리 속도 비교](https://github.com/JaeyeoneeJ/TIL/blob/main/react/%EB%B8%8C%EB%9D%BC%EC%9A%B0%EC%A0%80%EC%97%90%EC%84%9C_%EC%9D%BC%EB%B0%98_%EC%9E%90%EB%B0%94%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8%EC%99%80_%EC%9B%B9%EC%96%B4%EC%85%88%EB%B8%94%EB%A6%AC_%EC%86%8D%EB%8F%84_%EB%B9%84%EA%B5%90.md)
  - [React App에서 wasm 파일 로드하기](https://github.com/JaeyeoneeJ/TIL/blob/main/react/React_App%EC%97%90%EC%84%9C_wasm_%ED%8C%8C%EC%9D%BC_%EB%A1%9C%EB%93%9C%ED%95%98%EA%B8%B0.md)
- 이 프로젝트에서 궁극적으로 목표하는 바는 다음과 같습니다.
  1. WebAssembly로 변환할 수 있는 저수준 언어(C/C++, Rust 등)를 작성한다.
  2. 저수준 언어로 작성한 파일을 WebAssembly 코드로 컴파일 한다.(mjs, wasm)
  3. React App에서 JavaScript와 C를 WebAssembly로 컴파일한 모듈(mjs, wasm)의 실행
  4. WebAssembly 파일을 가져와 사용한다.
  5. Web App에서 일반 JavaScript와 mjs, wasm으로 변환한 모듈의 속도 차이를 확인한다.
- 프로젝트 결과 예시
  <img src="https://github.com/JaeyeoneeJ/wasm-test/assets/77138259/61f56193-f628-4a37-b19c-ca13634d644b" alt="npm run start" />

## 1. 개발 환경

이 프로젝트는 다음과 같은 환경에서 개발되었습니다.

- npm: 6.14.7
- node: v16.17.0
- emcc: 3.1.51
- dependencies

  - "react": "^18.2.0",
  - "react-dom": "^18.2.0",
  - "react-scripts": "5.0.1"

- 이 프로젝트를 실행하기 위해서는 일반 react app으로 가능하지만, C 를 mjs 또는 wasm으로 변환하기 위해서는 emsdk의 설치 및 환경변수 설정이 필요합니다.
  - [Emscipten 공식 페이지](https://emscripten.org/docs/getting_started/downloads.html) 또는
  - [Emscripten 설치](https://github.com/JaeyeoneeJ/TIL/blob/main/JavaScript/Emscripten_%EC%84%A4%EC%B9%98.md)를 참고하여 주십시오.

## 2. 프로젝트 실행

### 1) `npm start` || `npm run start`

- 위 명령어를 통해 개발 모드의 앱을 실행할 수 있으며, [http://localhost:3000](http://localhost:3000)의 기본 포트의 브라우저에서 확인할 수 있습니다.
- 현재 git이 최신화 된 경우, wasm 폴더 내 `wasmModule.mjs` 파일과 `wasmModule.wasm` 파일이 존재하므로 실행이 가능합니다.

### 2) `npm run build:react`

- 위 명령어를 통해 개발 모드의 앱을 빌드할 수 있습니다.
- 만일 당신의 글로벌 환경에 http-server가 설치되어 있는 경우, 빌드 후, `npx http-server ./build`로 빌드된 앱을 확인할 수 있습니다.

### 3) `npm run build:wasm-mjs` || `npm run build:wasm`

- 위 명령어를 통해 `src/wasm/` 내 모든 C 를 `wasmModule.mjs` 또는 `wasmModule.wasm` 단일 파일로 컴파일할 수 있습니다.
- export하는 함수 또는 변수 명이 중복되지 않도록 유의하여야 합니다.
- 두 명령어를 동시에 실행할 경우, 반드시 mjs 빌드를 먼저 실행하여야 하는 점을 유의하시기 바랍니다.

### 4) `npm run build`

- 위 명령어를 통해 mjs 파일과 wasm 파일, react app을 동시에 빌드할 수 있습니다.

## 3. 프로젝트 확인

- `App.js` 내 `WasmModule` 컴포넌트의 prop을 통해 원하는 데이터 값을 설정하고 결과를 확인할 수 있습니다.

```jsx
<WasmModule debug data={data} />
```

> 만일 메모리 관련 에러가 발생할 경우, emcc 스크립트 옵션 또는 `wasmModule.jsx`의 `importObject`를 변경하여보시기 바랍니다.
