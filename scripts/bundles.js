exports.packages = [
  {
    entry: '@dxjs/core',
    global: 'Dx',
    externals: [
      { entry: 'react' },
      { entry: 'react-dom' },
      { entry: 'redux' },
      { entry: 'react-redux' },
      { entry: 'redux-saga' },
      { entry: 'redux-saga/effects' },
      { entry: '@dxjs/common' },
      { entry: 'reflect-metadata' },
      { entry: 'es6-symbol' },
    ],
  },
  {
    entry: '@dxjs/common',
    global: 'DxCommon',
    externals: [
      { entry: 'react' },
      { entry: 'react-dom' },
      { entry: 'redux-saga' },
      { entry: 'redux-saga/effects' },
      { entry: 'react-redux' },
      { entry: 'reflect-metadata' },
      { entry: 'es6-symbol' },
    ],
  },
];

const UMD = 'UMD';
const UMD_DEV = 'UMD_DEV';
const CJS = 'CJS';
const CJS_DEV = 'CJS_DEV';

exports.bundleTypes = [UMD, UMD_DEV, CJS, CJS_DEV];
exports.UMD = UMD;
exports.UMD_DEV = UMD_DEV;
exports.CJS = CJS;
exports.CJS_DEV = CJS_DEV;
