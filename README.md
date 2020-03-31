# dx.js

和 Dva 很像，同样基于 redux、redux-saga 的一套组织副作用、状态管理的框架，并且基于 Typescript。

### 与 Dva

- 同样基于 redux、saga
- 也有 effects、reducers
- 更好的拦截器机制

### 快速开始

```javascript
// 入口
import React from "react" 
import { Dx } from "@dxjs/core" 
import { ErrorInterceptor } from "@dxjs/common"
import App from "./app"

Dx.create({
    // 引入所有的 dx model
    models: [],
    // redux 的中间件
    middlewares: [],
    // 全局拦截器, 避免不合理的调用
    gateways: [],
    // 管道
    pipes: [],
    // 守卫
    guards: [],
    // 注入给 Models 的参数
    injects: [history, utils, ...],
})

Dx.run(() => <App />, "#root")

// 网关用来做数据转换、拦截无效调用

// model
import { DxMoel } from "@dxjs/core" 
import { Reducer, Effect } from "@dxjs/common"
import { Take, TakeMaybe, Takelatest, TakeEvery, TakeLeading } from "@dxjs/saga"
import { RequiredParamsGateway, UserTransform } from "../xxx/"
import { ErrorPipe } from "../pipe/"
import { LoggerGuard } from "../guards/"
import AuthModel from "./authModel"

class User extends DxMoel {
    state = {}

    constructor(private dispatch: IDispatch, private history: IHistory, utils: IUtils ) {}

    // 内置 immer
    @Reducer
    updateState(payload, state) {
        this.state.user.name = payload
        // state.current.user.name = payload
    }

    @Reducer
    // 实际上我传的是 userId, 但是通过网关的转换，我能过获取到对应的 user 实体
    // 通过 select 可以直接取对应的 state
    // 为了保持 sate 的引用，不得已新增了 current
    updateUser(@UserTransform user: UserEntity, @Select((payload, state) => state.users.find((user) => payload.id === user.id)) state) {
        // 不能直接覆盖 current, 但是可以通过特殊提供的 replace 覆盖
        state.current.$replace(user)
    }

    @Reducer
    @RequiredParamsGateway
    deleteUserById(id: string, state) {
        _.remove(this.state.users, (user => user.id === id))
    }

    // 第一个参数是 action
    // 第二个参数是 saga 的 api
    // 第三个参数是在全局注入的参数
    @Effect
    *deleteUserById(action, [_, utils]) {
        // 默认情况下的模式是 TakeEvery
        tihs.$put()
        tihs.$select()
        tihs.$call()
        tihs.$fork()
    }

    @Effect(Takelatest)
    // 每一个任务同时也会被挂载在 static 上
    @Take(AuthModel.login)
    // 管道可以根据上下文做一些事情，甚至可以中断、改变原来的结构
    @ErrorPipe(["获取用户 token 异常", "用户信息不匹配"])
    // 守卫是一种兜底行为，可以上层出错的时候，能够获取一些上下文的数据
    @LoggerGuard
    *getUserInfo(_, { call, put }, [_, _, services]) {
        // 利用 ErrorPipi，再也不用一个一个的 try cache
        const userToken = yield call(services.getUserToken)
        const userInfo = yield call(services.getUserInfo, userToken)
    }
}

```


这是一个类 Dev 库，通过 `ES6` 的 `Class` 来组织代码, 能够与 saga 同时存在，做到潜移默化的从 saga 转到 dva


## Quick Start

```javascript
// modelA.js
import { deco } from 'dva-class'

@deco.action
export default class User {

    state = {
        name: ''
    }

    // reducer
    updateState() {}

    // effect
    @deco.takeLatest
    *getUserInfo() {}
}

// appWithSaga.js
import dva from 'dva-class'
import { createStore, applyMiddleware, combineReducers } from 'redux'

const sagaMiddleware = createSagaMiddleware()

const app = dva({
    reducerEnhancer: [require('immer')]
})

app.model(require('modelA.js'))

const store = createStore(
  combineReducers(dva.combineReducers()),
  applyMiddleware(sagaMiddleware)
)

app.runSaga(sagaMiddleware)

// appWithoutSaga.js
import dva from 'dva-class'
import { createStore, applyMiddleware, combineReducers } from 'redux'

const sagaMiddleware = createSagaMiddleware()

const app = dva({
    reducerEnhancer: [require('immer')]
})

app.model(require('modelA.js'))

app.start()

const store = app.getStore()

```

## API

### dva.model

实例化每一个 model, 

### dva.start

创建 redux 的 store, 

### dva.runSaga

传入 sagaMiddleware， 在已经集成了 saga 的应用中不应该直接 start, 而是调用 `dva.runSaga` 和 `dva.combineReducers` 把 model 集成到现有的应用中

### dva.combineReducers

获取 model 中的所有的 reducers

### deco.action 装饰器

自动为 model 创建 action

```javascript

// 引用 Example

User.getUserInfo(userId)
// 返回 { type: 'User/getUserInfo', payloadL userId }

```

### deco.takeLatest 装饰器

```javascript
// 内部会构造成
takeLatest('User/getUserInfo', user.getUserInfo)
```

### deco.throttle 装饰器

```javascript
// 内部会构造成
throttle('User/getUserInfo', user.getUserInfo)
```

### 默认的 effects
```javascript
// 内部会构造成
takeEvery('User/getUserInfo', user.getUserInfo)
```

