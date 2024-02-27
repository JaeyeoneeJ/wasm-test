# wasm-test

이 프로젝트는 React App에서 WebAssembly를 적용하고 순수 JavaScript와 WebAssembly로 컴파일한 모듈의 런타임 차이를 확인하기 위한 방법을 연구하기 위해 제작되었습니다.

## 개발 환경

이 프로젝트는 다음과 같은 환경에서 개발되었습니다.

npm: 6.14.7
node: v16.17.0
emcc: 3.1.51

- dependencies
  - "react": "^18.2.0",
  - "react-dom": "^18.2.0",
  - "react-scripts": "5.0.1"

## 프로젝트 실행

이 프로젝트를 실행하기 위해서는 일반 react app으로 가능하지만, C 를 mjs 또는 wasm으로 변환하기 위해서는 emsdk의 설치 및 환경변수 설정이 필요합니다.

- [Emscipten 공식 페이지](https://emscripten.org/docs/getting_started/downloads.html) 또는
- [Emscripten\_설치](https://github.com/JaeyeoneeJ/TIL/blob/main/JavaScript/Emscripten_%EC%84%A4%EC%B9%98.md)를 참고하여 주십시오.

- scripts
  - "start": "react-scripts start",
  - "build:react": "react-scripts build",
  - "build:wasm-mjs": "emcc --no-entry src/wasm/\*.c -o src/wasm/wasmModule.mjs -s ENVIRONMENT='web' -s SINGLE_FILE=1 -s EXPORT_NAME='createModule' -s USE_ES6_IMPORT_META=0 -s EXPORTED_FUNCTIONS='[_add, _array, _malloc, _free]' -s EXPORTED_RUNTIME_METHODS='[ccall, cwrap]' -O3 -s MODULARIZE=1",
  - "build:wasm": "emcc --no-entry src/wasm/\*.c -o src/wasm/wasmModule.wasm -s ENVIRONMENT='web' -s SINGLE_FILE=1 -s EXPORT_NAME='createModule' -s USE_ES6_IMPORT_META=0 -s EXPORTED_FUNCTIONS='[_add, _array, _malloc, _free]' -s EXPORTED_RUNTIME_METHODS='[ccall, cwrap]' -O3 -s MODULARIZE=1",
  - "build": "npm run build:wasm-mjs && npm run build:wasm && npm run build:react"

### `npm start || npm run start`

- 위 명령어를 통해 개발 모드의 앱을 실행할 수 있으며, [http://localhost:3000](http://localhost:3000)의 기본 포트의 브라우저에서 확인할 수 있습니다.
- 현재 git이 최신화 된 경우, wasm 폴더 내 `wasmModule.mjs` 파일과 `wasmModule.wasm` 파일이 존재하므로 실행이 가능합니다.

### `npm run build:react`

- 위 명령어를 통해 개발 모드의 앱을 빌드할 수 있습니다.
- 만일 당신의 글로벌 환경에 http-server가 설치되어 있는 경우, 빌드 후, `npx http-server ./build`로 빌드된 앱을 확인할 수 있습니다.
