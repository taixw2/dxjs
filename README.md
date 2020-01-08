# dva-class

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

