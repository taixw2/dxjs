# dxjs

[![Codecov Coverage](https://img.shields.io/codecov/c/github/taixw2/dx/master.svg?style=flat-square)](https://codecov.io/gh/taixw2/dx/)
[![NPM Version](https://img.shields.io/npm/v/@dxjs/core?style=flat)](https://npmjs.com/package/@dxjs/core)

基于 Redux、Redux-saga、Typescripe 的库，用来组织应用中的副作用和管理状态

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

