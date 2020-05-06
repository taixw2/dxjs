---
title: API
sidebar: auto
sidebarDepth: 3
---

# @dxjs/core

## DxFactor

对于需要多个 Dx/redux 实例的应用来说非常有用，
- 参数
  - `无`
- 用法
```javascript
const Dx = DxFactory()
```

## Dx.cerate

Dx 的基础方法，`Dx.create` 返回一个 `ReactCompoent`
- 参数
  - `{DxModelContstructor[] | { [key: string]: DxModelContstructor }} models`
  - `{Middleware[]} middlewares` redux 的 middlewares
  - `{EffectMiddleware[]} sagaMiddlewares` saga 的 middlewares
  - `{Enhancer<ReducerEnhancer>[][]} reducerEnhancer` reducer 增强器
  - `{Enhancer<SentinelInterface>[]} sentinels` 哨兵
  - `{Enhancer<DisguiserStatic>[]} disguisers` 伪装者
  - `{Enhancer<GuardInterface>[]} guards` 守卫
- 用法
```javascript
Dx.create({
  models: [],
  middlewares: [],
  sagaMiddlewares: [],
  reducerEnhancer: [],
  sentinels: [],
  disguisers: [],
  guards: []
})
```

## Dx.createStore

与 `Dx.create` 参数一样，唯一的区别是 `Dx.createStore` 返回 redux 的 store

## DxModel

所有  model 的父类，封装了所有 saga 的 effect

- 用法
```javascript
class UserModel extends DxModel {
  state = {}
}
```

## Sentinel

哨兵的父类，哨兵既可以是一个函数，也可以基于类，但是需要继承 `Sentinel`

- 方法
  - `getState` 获取当前的 state
  - `getPayload` 获取 action 的数据
  - `dispatchCurrentAction` 重新派发当前 action, 传入参数替换当前 payload

- 用法
```javascript
class MockSentinel extends Sentinel {
  async sentinel(): Promise<boolean> {
    this.getState()
    return true
  }
}
```

## Disguiser

伪装者的父类

- 方法
  - `abort` 中断 effect
  - `next` 执行 effect 的一个 yield
  - `getPayload` 获取 action 的数据
  - `dispatchCurrentAction` 重新派发当前 action, 传入参数替换当前 payload
- 用法
```javascript
class MockDisguiser extends Disguiser implements DisguiserInterface {
  *disguiser(): Generator {
    yield this.next()
    yield this.abort()
  }
}
```

## Guard

守卫的父类

- 方法
  - `getData` 获取 effect return 的数据
  - `getError` 获取报错
  - `getPayload` 获取 action 的数据
  - `getState` 获取当前的 state
  - `dispatchCurrentAction`  重新派发当前 action, 传入参数替换当前 payload

- 用法
```javascript
class MockGuard extends Guard implements GuardInterface {
  async guard(): Promise<void> {
    return;
  }
}
```

# @dxjs/common

## Effect

effect 装饰器

- 用法
```javascript
class UserModel extends DxModel {
  @Effect()
  @Effect(TakeEvery)
  @Effect("actionType", TakeEvery)
  @Effect(Throttle, 350)
  @Effect("actionType", Throttle, 350)
  *getUserInfo() {}
}
```


## Reducer

reducer 装饰器

- 用法
```javascript
class UserModel extends DxModel {
  @Reducer()
  @Reducer("actionType")
  updateUserInfo() {}
}
```

## Label

标记

- 用法
```javascript
class UserModel extends DxModel {
  @Label("a", "b", "c")
  updateUserInfo() {}
}
```

## TakeEvery

effect helper

- 用法
```javascript
class UserModel extends DxModel {
  @Effect(TakeEvery)
  updateUserInfo() {}
}
```

## TakeLeading

effect helper

- 用法
```javascript
class UserModel extends DxModel {
  @Effect(TakeLeading)
  updateUserInfo() {}
}
```

## TakeLatest

effect helper

- 用法
```javascript
class UserModel extends DxModel {
  @Effect(TakeLatest)
  updateUserInfo() {}
}
```

## Throttle

effect helper

- 用法
```javascript
class UserModel extends DxModel {
  @Effect(Throttle)
  updateUserInfo() {}
}
```


