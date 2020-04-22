# dxjs

[![Codecov Coverage](https://img.shields.io/codecov/c/github/taixw2/dx/master.svg?style=flat-square)](https://codecov.io/gh/taixw2/dx/)
[![NPM Version](https://img.shields.io/npm/v/@dxjs/core?style=flat)](https://npmjs.com/package/@dxjs/core)

基于 Redux、React-Redux、Redux-saga、Typescripe 的状态管理库

### 特性

- **防 `action type` 冲突**，通过 Symbol 作为 `action type`
- **用 Class 组织 model**，通过装饰器区分 effect 和 reducers 以及更多有用的装饰器
- **基于 Typescript**，类型安全检查
- **装饰器**，面向 AOP 的编程模式
- **增强器**，可以在数据流的任何时候植入逻辑， 1秒集成 `immer`

> 如果你对装饰器和 `Typescript` 还不太熟悉，建议先花半个小时了解一些基本语法，但这并不会影响你使用，如果你没有用过 `React`、`Redux`、`Redux-Saga`，建议先在项目中尝试一下，或者写一些小 demo，如果你有使用 `Dva` 的经验，那么应该很快就能熟悉这个库

### 安装

```sh
npm install @dxjs/core @dxjs/common
# 或者
yarn add @dxjs/core @dxjs/common
```

### 快速开始

```javascript
// 入口
import React from "react"
import { Dx } from "@dxjs/core"
import App from "./app"

const DxApp = Dx.create()

ReactDOM.render((<DxApp><App /></DxApp>), document.getElementById('root'))

// model
import { Dx, DxMoel } from "@dxjs/core"
import { Reducer, Effect } from "@dxjs/common"

@Dx.collect()
class Counter extends DxMoel {
    state = {
        count: 0
    }

    @Reducer
    updateState(count, state) {
        this.state.count = count
    }

    @Effect
    *asyncUpdateState() {
        yield this.$delay(1000)
        yield this.$put(Counter.updateState(200))
    }
}
```
### example

- [sample \(by create-react-app\)](./examples/create-react-app)
- [sample2 \(by taro\)](./examples/taro-sample)

