import { store } from '../../helper/store';
import { Reducer, Dispatch, AnyAction, Store } from 'redux';
import { ForkEffect, spawn, all } from 'redux-saga/effects';
import { createReducer } from '../create-reducer';
import { createEffect } from '../create-effect';
import { MODEL_NAME } from '@dxjs/shared/symbol';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import reduxSaga from 'redux-saga';
import { CreateOption } from '@dxjs/shared/interfaces/dx-create-option.interface';
import { promiseMiddleware } from './promise-middleware';
import { createAction } from '../create-action';
import { resolve } from '../../utils';
import { DxModelInterface } from '@dxjs/shared/interfaces/dx-model.interface';

const nonp = (): void => undefined;

const createSagaMiddleware = resolve.getExportFromNamespace(reduxSaga);

/**
 * 重组 effect 和 reducer
 */
function recombinEffectAndReducer(dispatch: Dispatch): [{ [key: string]: Reducer }, ForkEffect[], DxModelInterface[]] {
  const reducers: { [key: string]: Reducer } = {};
  const effects: ForkEffect[] = [];
  const models: DxModelInterface[] = [];
  store.getModels().set.forEach(ModelConstructor => {
    const model = new ModelConstructor(dispatch);
    const modelReducer = createReducer(model);
    const modelEffect = createEffect(model);

    const modelName = Reflect.getMetadata(MODEL_NAME, ModelConstructor);
    if (modelReducer) {
      reducers[modelName] = modelReducer;
    }
    if (modelEffect) {
      effects.push(spawn(modelEffect));
    }

    models.push(model);
  });

  return [reducers, effects, models];
}

/**
 * 调用 redux 的 create store
 * 生成 redux store
 */
export function combinStore(options: CreateOption): Store {
  const optionsMiddlewares = options.middlewares ?? [];
  const sagaMiddleware = createSagaMiddleware({
    onError: options.onSagaError,
    effectMiddlewares: options.sagaMiddlewares,
  });

  const middlewares = [promiseMiddleware(), sagaMiddleware, ...optionsMiddlewares];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const store = createStore<any, AnyAction, {}, {}>(nonp, applyMiddleware(...middlewares));
  const [reducers, effects, models] = recombinEffectAndReducer(store.dispatch);
  store.replaceReducer(combineReducers({ __dxjs: () => '__dxjs', ...reducers }));
  sagaMiddleware.run(function*() {
    yield all(effects);
  });

  createAction(store.dispatch);

  // 初始化
  models.forEach(model => model.init?.());
  return store;
}
