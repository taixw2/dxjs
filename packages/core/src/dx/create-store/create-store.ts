import { store } from '../../helper/store';
import { Reducer, Dispatch, AnyAction, Store } from 'redux';
import { ForkEffect, spawn, all } from 'redux-saga/effects';
import { createReducer } from '../create-reducer';
import { createEffect } from '../create-effect';
import { MODEL_NAME } from '@dxjs/shared/symbol';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { default as saga } from 'redux-saga';
import { CreateOption } from '@dxjs/shared/interfaces/dx-create-option.interface';
import { promiseMiddleware } from './promise-middleware';
import { createAction } from '../create-action';

// @https://github.com/rollup/rollup/issues/2554
// rollup 打包的时候会直接通过 require('redux-saga'),
// 并不会像 typescript 使用 _importDefault 类似的垫片
const createSagaMiddleware = Reflect.get(saga as object, 'default') as typeof saga;

const nonp = (): void => undefined;

/**
 * 重组 effect 和 reducer
 */
function recombinEffectAndReducer(inst: symbol, dispatch: Dispatch): [{ [key: string]: Reducer }, ForkEffect[]] {
  const reducers: { [key: string]: Reducer } = {};
  const effects: ForkEffect[] = [];
  store.getModels(inst).set.forEach(ModelConstructor => {
    const model = new ModelConstructor(dispatch);
    const modelReducer = createReducer(inst, model);
    const modelEffect = createEffect(inst, model);

    const modelName = Reflect.getMetadata(MODEL_NAME, ModelConstructor);
    if (modelReducer) {
      reducers[modelName] = modelReducer;
    }
    if (modelEffect) {
      effects.push(spawn(modelEffect));
    }
  });

  return [reducers, effects];
}

/**
 * 生成 redux store
 */
export function combinStore(inst: symbol, options: CreateOption): Store {
  const optionsMiddlewares = options.middlewares ?? [];
  const sagaMiddleware = createSagaMiddleware({
    onError: () => undefined,
    effectMiddlewares: options.sagaMiddlewares,
  });

  const middlewares = [promiseMiddleware(inst), sagaMiddleware, ...optionsMiddlewares];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const istore = createStore<any, AnyAction, {}, {}>(nonp, applyMiddleware(...middlewares));
  const [reducers, effects] = recombinEffectAndReducer(inst, istore.dispatch);
  istore.replaceReducer(combineReducers({ __dxjs: () => '__dxjs', ...reducers }));
  sagaMiddleware.run(function*() {
    yield all(effects);
  });

  createAction(inst, istore.dispatch);
  store.reduxStore.set(inst, istore);
  return istore;
}
