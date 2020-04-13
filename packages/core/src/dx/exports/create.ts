import * as React from 'react';
import { CreateOption } from '@dxjs/common/interfaces/dx-create-option.interface';
import { all, ForkEffect, spawn } from 'redux-saga/effects';
import { createStore, applyMiddleware, combineReducers, Action } from 'redux';
import { Provider } from 'react-redux';
import createSagaMiddleware from 'redux-saga';
import { createReducer } from '../create-reducer';
import { createSaga } from '../create-saga';
import { MODEL_NAME } from '@dxjs/common/shared';
import { EnhancerFilter, Enhancer } from '@dxjs/common/interfaces/dx-enhancer.interface';
import invariant = require('invariant');
import { createAction } from '../create-action';
import { store } from '../../helper/store';

function creteEnhancer<T>(enhancers?: Enhancer<T>[]): EnhancerFilter<T>[] {
  if (!enhancers) return [];
  return enhancers.map((enhancer: Enhancer<T>, i: number) => {
    if (typeof enhancer === 'object') {
      const _enhancer = enhancer as EnhancerFilter<T>;

      if (process.env.NODE_ENV === 'development') {
        invariant(
          Reflect.has(_enhancer, 'enhancer'),
          '第 %s 个增强器必须包含 enhancer 属性, 当前类型为：%s',
          i,
          typeof enhancer,
        );
      }

      return {
        include: _enhancer.include ?? '*',
        exclude: _enhancer.exclude,
        enhancer: _enhancer.enhancer,
      };
    }

    return {
      include: '*',
      enhancer: enhancer as T,
    };
  });
}

export function createFactory(inst: symbol) {
  return <T>(options?: CreateOption<T>): React.SFC => {
    store.enhancer.set(inst, {
      reducerEnhancer: creteEnhancer(options?.reducerEnhancer),
      sentinels: creteEnhancer(options?.sentinels),
      invaders: creteEnhancer(options?.invaders),
      guards: creteEnhancer(options?.guards),
    });

    // TODO: 处理 model
    const models = store.getModels(inst);
    if (Array.isArray(options?.models)) {
      let Model;
      while ((Model = options?.models.shift())) {
        Reflect.defineMetadata(MODEL_NAME, Model.name, Model);
        models.map[Model.name] = Model;
        models.set.add(Model);
      }
    } else {
      if (process.env.NODE_ENV === 'development') {
        invariant(
          typeof options?.models === 'undefined' ||
            Object.prototype.toString.call(options?.models) === '[object Object]',
          'models 必须是一个数组或者是一个纯对象, 当前数组类型为: %s',
          typeof options?.models,
        );
      }
    }

    // TODO: 此时已经包含了所有的 model, 开始遍历创建 reducer 和 effect 以及 state 和 action
    const sagaMiddleware = createSagaMiddleware({
      effectMiddlewares: options?.sagaMiddlewares,
    });
    const rstore = createStore(s => s, applyMiddleware(sagaMiddleware, ...options?.middlewares));

    function dispatch(action: Action): void {
      // TODO: Promise
      rstore.dispatch(action);
    }

    const recombine = [...models.set].reduce(
      (reco, Model) => {
        const model = new Model(dispatch);
        reco.reducers[Reflect.getMetadata(MODEL_NAME, Model)] = createReducer(model, inst);
        reco.sagas.push(spawn(createSaga(model)));
        return reco;
      },
      {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        reducers: {} as { [key: string]: any },
        sagas: [] as ForkEffect[],
      },
    );

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    function* rootSaga() {
      yield all(recombine.sagas);
    }

    const rootReducer = combineReducers(recombine.reducers);
    rstore.replaceReducer(rootReducer);
    sagaMiddleware.run(rootSaga);

    // 封装 dispatch
    createAction(dispatch, inst);
    return <T>(props: React.PropsWithChildren<T>): React.ReactElement => {
      return React.createElement(Provider, { store: rstore, ...props });
    };
  };
}
