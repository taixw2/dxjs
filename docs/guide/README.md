---
title: 指南
sidebarDepth: 2
---

## 介绍

### 为什么会有 Dxjs

Dxjs 为了解决项目中实际遇到的问题，最初某个项目采用的 redux + redux-saga 做的状态管理，但是每次都要定义 Action Type，并且还要保证 Action Type 和原来的定义的不一样，这样会导致大量的工作，以及难以排查的问题，后来我想引入 Dva，但是很难与现有的 redux-saga 同时使用，之后就花了两三天时间写了一个类 Dva，再往后逐步增强，就产生了 [Dxjs](https://github.com/taixw2/dxjs/)

### Dxjs 能做什么

它对数据流的每一个阶段都加入了钩子，加入了哨兵、伪装者、守卫，分别对应在 effect 执行前，执行时，执行后，以及 reducer 的增强器，能够很方便的集成 immer 等库。

它采用类来管理 Effect、State，通过装饰器来来辨别是 reducer 或 effect，以及 constructor 能够做一些初始化的事情

## 安装

### 安装

1. dxjs 内部依赖 symbol 以及 reflect.metadata, 所以对于低级浏览器，需要先引入对于的 polyfill
2. 引入 redux 的三件套：`react`、`react-dom`、`react-redux`
3. 引入 dxjs: `@dxjs/core`、`@dxjs/common`

```sh
npm install reflect-metadata es6-symbol # polyfill
npm install react react-dom react-redux 
npm install @dxjs/core @dxjs/common
```

### 在 taro 中安装

1. 在 taro 中同样需要引入 polyfill
2. 引入 taro 的 redux polyfill
3. 引入 dxjs
4. 修改 config/index.js

```sh
npm install reflect-metadata es6-symbol
npm install @tarojs/redux @tarojs/redux-h5
npm install @dxjs/core @dxjs/common
```
> config/index.js
```sh
alias: {
  "react": require.resolve("@tarojs/taro"),
  "react-dom": require.resolve("@tarojs/taro"),
  "react-redux": require.resolve("@tarojs/redux"),
}
```
