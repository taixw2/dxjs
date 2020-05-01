---
home: true
actionText: Get Started →
actionLink: /guide/
features:
  - title: Action Type 基于 Symbol
    details: 避免 Action Type 冲突，通过方法名换取 Action, 免去定义 🤡👺
  - title: 基于 Class 的 Model
    details: 更多 ES6+ 特性可用，私有属性、装饰器、继承 🥰👏
  - title: Typescript
    details: 静态类型检查，减少类型错误，增强代码的鲁棒性 🐛🦾
  - title: 增强器
    details: 在数据流各个阶段加入逻辑，减少模板代码，增强代码可读性 🛠🔧
  - title: 易扩展
    details: 利用装饰器，减少对原代码的伤害 🧻💾
  - title: 易使用
    details: 返回 React Component，把 ReactDOM.render 控制权交给自己 🔍📕
footer: MIT Licensed | Copyright © 2018-present Mro
---

## 开始使用

> src/index.ts

```javascript
import React from 'react';
import { Dx } from '@dxjs/core';
import App from './app';
import './user.model.ts';

const DxApp = Dx.create();
ReactDOM.render(
  <DxApp>
    <App />
  </DxApp>,
  document.getElementById('root'),
);
```

> src/user.model.ts

```javascript
import { DxMoel, Dx } from '@dxjs/core';
import { Reducer, Effect } from '@dxjs/common';
import { Take, Takelatest } from '@dxjs/saga';
import services from '../services';

export interface IUserModelState {
  id: string;
  nickname: string;
}

@Dx.collect()
export default class UserModel extends DxModel<IUserModelState> {
  state = {
    id: '',
    nickname: '',
  };

  @Reducer()
  // 内部

  updateNickname(payload: string) {
    this.state.nickname = payload;
  }

  @Reducer()
  logined(logined: boolean) {
    // TODO
  }

  @Effect("name", Takelatest)
  *getUserInfo(payload: string) {
    const userInfo = yield this.$call(services.getUserInfo);
    yield this.$put(UserModel.updateNickname(userInfo.nickname));
  }
}
```

> src/app.ts

```javascript
import React from 'react';
import { Dx } from '@dxjs/core';
import UserModel from './user.model.ts';

const mapStateToProps = state => {
  return {
    id: state.UserModel,
  };
};

@connect(mapStateToProps)
export default class App extends React.Component {
  componentDidMount() {
    // 自动 dispatch
    UserModel.updateNickname('username', true)
    // 返回 action, 不 dispatch
    UserModel.updateNickname('username')
  }
}
```
