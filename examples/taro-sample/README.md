
# 在 Taro 中使用 Dxjs

由于 Taro 环境与普通的 React 构建环境有些许差异，所以需要做一些简单的适配工作

1. config 中设置 alias
```javascript
  // config/index.js
  alias: {
    "react": require.resolve("@tarojs/taro"),
    "react-dom": require.resolve("@tarojs/taro"),
  }
```

2. 由于 taro 默认的 babel 环境不兼容装饰器与生成函数同时使用，所以在 taro 环境中，model 中所有的生成器函数都被认为是 effect，坏处就是无法使用像 Label 等装饰器，如果有兼容方案，望告知
```javascript
  // config/index.js
  class Model extends DxModel {

    // 不支持
    @Effect()
    *asyncUpdate() {

    }

    // 支持
    *asyncUpdate() {

    }
  }
```


