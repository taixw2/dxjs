const rollup = require('rollup');
const path = require('path');
const chalk = require('chalk');
const rmfr = require('rmfr');
const ncp = require('ncp').ncp;
const mkdirp = require('mkdirp');
const fs = require('fs');
const babel = require('rollup-plugin-babel');
const commonjs = require('rollup-plugin-commonjs');
const resolve = require('rollup-plugin-node-resolve');
const gzip = require('gzip-size');
const babelCore = require("@babel/core")
const react = require('react');
const reactDom = require('react-dom');
const reactIs = require('react-is');
const propTypes = require('prop-types');
const reactRedux = require('react-redux');

const packages = [
  { entry: '@dxjs/core', global: 'Dx' },
  { entry: '@dxjs/common', global: 'DxCommon' },
];

const externals = [
  { entry: 'react', global: 'React' },
  { entry: 'react-dom', global: 'ReactDom' },
]

const UMD = 'UMD';
const UMD_DEV = 'UMD_DEV';
const CJS = 'CJS';
const CJS_DEV = 'CJS_DEV';

const bundleTypes = [UMD, UMD_DEV, CJS, CJS_DEV];

function getPackgeFileName(packageName, bundleType) {
  switch (bundleType) {
    case CJS:
    case UMD:
      return `${packageName}.production.min.js`;
    case UMD_DEV:
    case CJS_DEV:
      return `${packageName}.development.js`;
    default:
      //
      break;
  }
}

function getFormat(bundleType) {
  switch (bundleType) {
    case UMD_DEV:
    case UMD:
      return 'umd';
    case CJS:
    case CJS_DEV:
      return 'cjs';
    default:
      //
      break;
  }
  return 'umd'
}

function getOutoutPath(packageName, bundleType, filename) {
  return `build/${packageName}/${getFormat(bundleType)}/${filename}`;
}

function getNodeEnv(bundleType) {
  switch (bundleType) {
    case CJS:
    case UMD:
      return 'production';
    case UMD_DEV:
    case CJS_DEV:
      return 'development';
    default:
      //
      break;
  }
}

function getGloabls() {
  return [...packages, ...externals].reduce((a, b) => {
    a[b.entry] = b.global
    return a
  }, {})
}

function getPackageName(package) {
  return package.split('/')[1];
}

async function createBundle(package, bundleType) {
  // 获取文件名称
  const { entry, global: globalName } = package;
  const packageName = getPackageName(entry);
  const packageFileName = getPackgeFileName(packageName, bundleType);
  const tag = chalk.white.bold(packageFileName) + chalk.dim(` (${bundleType})`);
  console.log(chalk.bgYellow.black(' BUILDING   '), tag);

  process.env.NODE_ENV = getNodeEnv(bundleType);
  const isProduction = process.env.NODE_ENV === "production"
  // 获取输出路径
  const bundlerOption = {
    outDir: getOutoutPath(packageName, bundleType, packageFileName),
    outFile: packageFileName,
    bundleNodeModules: true,
    target: 'browser',
    watch: false,
    logLevel: 5,
    hmr: false,
    sourceMaps: process.env.NODE_ENV === 'development',
    detailedReport: false,
  };

  try {
    const entryFile = require.resolve(entry);

    const bundle = await rollup.rollup({
      input: entryFile,
      external: externals.map(v => v.entry),
      plugins: [
        babel({
          configFile: path.resolve('.babelrc'),
          exclude: 'node_modules/**',
          extensions: [
            ...babelCore.DEFAULT_EXTENSIONS,
            '.ts',
          ]
        }),
        resolve({
          extensions: ['.js', '.ts']
        }),
        commonjs({
          namedExports: {
            react: Object.keys(react),
            'react-dom': Object.keys(reactDom),
            'react-redux': Object.keys(reactRedux),
            'react-is': Object.keys(reactIs),
            'prop-types': Object.keys(propTypes),
          },
        }),
      ]
    });

    const globals = { ...getGloabls() }
    Reflect.deleteProperty(globals, entry)
    await bundle.write({
      // output option
      file: getOutoutPath(packageName, bundleType, packageFileName),
      format: getFormat(bundleType),
      // 全局的模块
      globals: globals,
      freeze: false,
      name: globalName,
      interop: false,
      sourcemap: !isProduction,
    });
  } catch (error) {
    console.log(chalk.bgRed.black(' BUILD FAIL '), tag);
    throw error;
  }
  console.log(chalk.bgGreen.black(' COMPLETE   '), tag);
}

async function copyTo(from, to) {
  await mkdirp(path.dirname(to));
  return new Promise((resolve, reject) => {
    ncp(from, to, err => {
      err && reject(err);
      resolve();
    });
  });
}

function copyResource() {
  const tasks = fs.readdirSync('packages').map(async name => {
    const fromBaseDir = path.join('packages', name);
    const toBaseDir = path.join('build', name);
    if (!fs.existsSync(toBaseDir)) return;

    await copyTo(path.join(fromBaseDir, 'npm'), path.join(toBaseDir));
    await copyTo('LICENSE', path.join(toBaseDir, 'LICENSE'));
    await copyTo(path.join(fromBaseDir, 'package.json'), path.join(toBaseDir, 'package.json'));
    await copyTo('README.md'), path.join(toBaseDir, 'README.md'));
  });

  return Promise.all(tasks);
}

async function build() {
  await rmfr('build');

  for (let index = 0; index < packages.length; index++) {
    const package = packages[index];
    await createBundle(package, UMD);
    await createBundle(package, UMD_DEV);
    await createBundle(package, CJS);
    await createBundle(package, CJS_DEV);
  }
  // 遍历所有的包
  await copyResource();
}

build();
