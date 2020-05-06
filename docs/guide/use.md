---
title: 使用
sidebarDepth: 3
---

尝试 Dxjs 最简单的方式就是写一个 [Hello World 例子](https://github.com/taixw2/dxjs/tree/master/examples/create-react-app)

## 创建 Dx

`Dx.create` 会返回一个 `ReactComponent`, 它只集成了 `react-redux` 的功能， 所以你需要自己去写初始化路由的代码。
对于不使用 `react-redux` 的环境，可以通过 `Dx.createStore` 返回一个 redux 的 store

```javascript
import { Dx } from '@dxjs/core';

const DxApp = Dx.create();
ReactDOM.render(<DxApp />);
```

## 创建 Dx model

作为 Dx 中的 model, 需要继承父类 `DxModel`，它封装了大部分的 saga 的 effect, 可以通过 `this.$put` 等访问。  
接着导出该 model， 通过 `Dx.create` 传入到 Dx 中维护， 或者直接使用 `@Dx.collect` 装饰器来收集

```typescript
import { Dx, DxModel } from '@dxjs/core';
import { Reducer } from '@dxjs/common';

@Dx.collect()
class UserModel extends DxModel {}
```

### 定义 default state

在 `DxModel` 中有一个 `state` 属性，在每次收到 action 时都会更新这个 state, 所以你可以通过 `this.state` 获取到最新的 state

```typescript
import { Dx, DxModel } from '@dxjs/core';

@Dx.collect()
class UserModel extends DxModel {
  state = { count: 0 };
}
```

### 定义 reducer

通过装饰器标记这是一个 reducer, 并且可以传入参数设置 action type

```typescript
import { Dx, DxModel } from '@dxjs/core';
import { Reducer } from '@dxjs/common';

@Dx.collect()
class UserModel extends DxModel {
  @Reducer()
  update(payload) {}
}
```

### 定义 effect

通过装饰器标记这是一个 effect, 并且可以传入参数设置 action type 以及 effect helper

```typescript
import { Dx, DxModel } from '@dxjs/core';
import { Effect, TakeEvery } from '@dxjs/common';

@Dx.collect()
class UserModel extends DxModel {
  @Effect(TakeEvery, 'action_type')
  *update(payload) {}
}
```

## 使用增强器

### 集成 immer

```typescript
import { Dx, DxModel } from '@dxjs/core';
import produce from 'immer';

const DxApp = Dx.create({
  reducerEnhancer: [produce],
});
ReactDOM.render(<DxApp />);
```

### 集成哨兵

哨兵在 effect 执行前执行，对于权限校验、需要登录的操作非常有用

```typescript
import { Dx, DxModel } from '@dxjs/core';
import produce from 'immer';

async function sentinel({ action, getState }) {
  // 返回 false 中断执行
  return false;
}

const DxApp = Dx.create({
  sentinels: [sentinel],
});
ReactDOM.render(<DxApp />);
```

### 集成伪装者

伪装者 能获取每一个 yield 的句柄，能够决定是否需要继续执行以及能够捕获每一个 yield 的异常

```typescript
import { Dx, DxModel, Disguiser } from '@dxjs/core';
import { DisguiserInterface } from '@dxjs/shared/interfaces/dx-disguiser.interface';
import produce from 'immer';

class ClassDisguiser extends Disguiser implements DisguiserInterface {
  *disguiser(): Generator {
    while (true) {
      try {
        yield this.next();
        if (true) return;
      } catch (e) {
        report(e);
      }
    }
    return;
  }
}

const DxApp = Dx.create({
  disguisers: [ClassDisguiser],
});
ReactDOM.render(<DxApp />);
```

### 集成守卫

除非哨兵已经中断执行，否则守卫不管 effect 是否报错都会被执行

```typescript
import { Dx, DxModel, Guard } from '@dxjs/core';
import { GuardInterface } from '@dxjs/shared/interfaces/dx-disguiser.interface';
import produce from 'immer';

class ClassGuard extends Guard implements GuardInterface {
  async guard(error?: Error, data?: any) {
    console.log('ClassGuard -> guard -> error', error);
  }
}

const DxApp = Dx.create({
  guards: [ClassGuard],
});
ReactDOM.render(<DxApp />);
```

### 使用Label

有的时候增强器并非适合所有的 effect，那么可以通过 label 排除或包含特定的

```typescript
import { Dx, DxModel, Guard } from '@dxjs/core';
import { Effect, TakeEvery, Label } from '@dxjs/common';
import { GuardInterface } from '@dxjs/shared/interfaces/dx-disguiser.interface';
import produce from 'immer';

class ClassGuard extends Guard implements GuardInterface {
  async guard(error?: Error, data?: any) {
    console.log('ClassGuard -> guard -> error', error);
  }
}

class Model extends DxModel {
  @Effect(TakeEvery)
  @Label('nologin')
  *asyncUpdate();
}

const DxApp = Dx.create({
  guards: [{ include: '*', exclude: /^no/, enhancer: ClassGuard }],
});
ReactDOM.render(<DxApp />);
```
