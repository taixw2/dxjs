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
const terser = require('rollup-plugin-terser').terser;
const replace = require('rollup-plugin-replace');
const gzip = require('gzip-size');
const babelCore = require('@babel/core');
const react = require('react');
const reactDom = require('react-dom');
const bundles = require('./bundles');

function getPackgeFileName(packageName, bundleType) {
  switch (bundleType) {
    case bundles.CJS:
    case bundles.UMD:
      return `${packageName}.production.min.js`;
    case bundles.UMD_DEV:
    case bundles.CJS_DEV:
      return `${packageName}.development.js`;
    default:
      //
      break;
  }
}

function getFormat(bundleType) {
  switch (bundleType) {
    case bundles.UMD_DEV:
    case bundles.UMD:
      return 'umd';
    case bundles.CJS:
    case bundles.CJS_DEV:
      return 'cjs';
    default:
      //
      break;
  }
  return 'umd';
}

function getOutoutPath(packageName, bundleType, filename) {
  return `build/${packageName}/${getFormat(bundleType)}/${filename}`;
}

function getNodeEnv(bundleType) {
  switch (bundleType) {
    case bundles.CJS:
    case bundles.UMD:
      return 'production';
    case bundles.UMD_DEV:
    case bundles.CJS_DEV:
      return 'development';
    default:
      //
      break;
  }
}

function combinGlobalModule(externals) {
  return externals.reduce((a, b) => ((a[b.entry] = b.global), a), {});
}

function getPackageName(package) {
  return package.split('/')[1];
}

/**
 * rollup build
 * @param {*} package 包
 * @param {*} bundleType  打包类型
 */
async function createBundle(package, bundleType) {
  // 获取文件名称
  const { entry, global: globalName, externals } = package;
  const packageName = getPackageName(entry);
  const packageFileName = getPackgeFileName(packageName, bundleType);
  const tag = chalk.white.bold(packageFileName) + chalk.dim(` (${bundleType})`);
  console.log(chalk.bgYellow.black(' BUILDING   '), tag);

  process.env.NODE_ENV = getNodeEnv(bundleType);
  const isProduction = process.env.NODE_ENV === 'production';

  try {
    const entryFile = require.resolve(entry);
    const bundle = await rollup.rollup({
      input: entryFile,
      external: externals.map(v => v.entry),
      plugins: [
        replace({
          __DEV__: !isProduction,
          __ISSUE__: 'https://github.com/taixw2/dxjs/issues',
        }),
        resolve({
          extensions: ['.js', '.ts'],
        }),
        commonjs({
          namedExports: {
            react: Object.keys(react),
            'react-dom': Object.keys(reactDom),
          },
        }),
        babel({
          configFile: path.resolve('.babelrc'),
          exclude: 'node_modules/**',
          runtimeHelpers: true,
          extensions: [...babelCore.DEFAULT_EXTENSIONS, '.ts'],
        }),
        isProduction && terser(),
      ],
    });

    await bundle.write({
      // output option
      file: getOutoutPath(packageName, bundleType, packageFileName),
      format: getFormat(bundleType),
      globals: combinGlobalModule(externals),
      exports: "auto",
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

/**
 * 将未参与打包的资源复制到输出目录中
 */
function copyResource() {
  const tasks = fs.readdirSync('packages').map(async name => {
    const fromBaseDir = path.join('packages', name);
    const toBaseDir = path.join('build', name);
    if (!fs.existsSync(toBaseDir)) {
      // 直接复制整个目录到 build
      await mkdirp(toBaseDir);

      await copyTo(fromBaseDir, toBaseDir);
      return;
    }

    await copyTo(path.join(fromBaseDir, 'npm'), path.join(toBaseDir));
    await copyTo('LICENSE', path.join(toBaseDir, 'LICENSE'));
    await copyTo(path.join(fromBaseDir, 'package.json'), path.join(toBaseDir, 'package.json'));
    await copyTo('README.md', path.join(toBaseDir, 'README.md'));
  });

  return Promise.all(tasks);
}

/**
 * 开始 Build
 * 打包 cjs + umd 模块
 */
async function build() {
  await rmfr('build');

  for (let index = 0; index < bundles.packages.length; index++) {
    const package = bundles.packages[index];
    await createBundle(package, bundles.UMD);
    await createBundle(package, bundles.UMD_DEV);
    await createBundle(package, bundles.CJS);
    await createBundle(package, bundles.CJS_DEV);
  }
  // 遍历所有的包
  await copyResource();
}

build();
