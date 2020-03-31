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
import App from "./app"

const DxApp = Dx.create({
    // 引入所有的 dx model
    models: [],
    // reducer 增强器，内部集成了 immer
    reducerEnhancer: [],
    // redux 的中间件
    middlewares: [],
    // 注入给 Models 和 effects 的参数，减少不必要的 import
    injects: [history, utils, ...],
    // 以下只能用于 effects
    // 全局拦截器, 避免不合理的调用
    gateways: [],
    // 管道
    pipes: [],
    // 守卫
    guards: [],
})

ReactDOM.render(<DxApp />, document.getElementById('root'))


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
    *getUserInfo(@Payload("payload") payload, [_, _, services]) {
        // 利用 ErrorPipi，再也不用一个一个的 try cache
        const userToken = yield call(services.getUserToken)
        const userInfo = yield call(services.getUserInfo, userToken)
    }
}

```

## API

### Dx

默认的实例，

### DxFactory

创建 Dx 的方法

### Take, TakeMaybe, Takelatest, TakeEvery, TakeLeading...

分别对应 saga 中的 Api

### BasePipeTransform

所有 pipe 的父类

### BaseGuard

所有 guard 的父类

### BaseGateway

所有 gateway 的父类

