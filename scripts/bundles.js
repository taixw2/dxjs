exports.packages = [
  {
    entry: '@dxjs/core',
    global: 'Dx',
    externals: [
      { entry: 'react', global: 'React' },
      { entry: 'react-dom', global: 'ReactDom' },
      { entry: 'redux', global: 'redux' },
      { entry: 'react-redux', global: 'reactRedux' },
      { entry: '@dxjs/common', global: 'DxCommon' },
      { entry: 'reflect-metadata', global: '' },
    ],
  },
  {
    entry: '@dxjs/common',
    global: 'DxCommon',
    externals: [
      { entry: 'react', global: 'React' },
      { entry: 'react-dom', global: 'ReactDom' },
      { entry: 'react-redux', global: 'ReactRedux' },
      { entry: 'reflect-metadata', global: '' },
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
