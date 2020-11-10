/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { REDUCER_METHODS_KEY, SymbolType } from '@dxjs/shared/symbol';
import { Reducer, AnyAction } from 'redux';
import { reducerHook } from './hooks/reducer';
import { beforeReducerHook } from './hooks/before-reducer';
import { afterReducerHook } from './hooks/after-reducer';
import { DxModel, DxModelContstructor } from '../../dx-model/model';

export function createReducer<T>(model: DxModel): Reducer | void {
  const Model = model.constructor as DxModelContstructor;

  // 获取 Model 中所有的 reducers
  // Map<actionType, method>
  const reducers = Reflect.getMetadata(REDUCER_METHODS_KEY, Model);
  if (!reducers || !reducers.length) return;

  const map = new Map<SymbolType, string>(reducers);
  const reducerEnhancer = reducerHook();
  return reducerEnhancer(
    (state: T, action: AnyAction): T => {
      model.state = state || model.state;
      if (action.ns && action.ns !== Model.name) {
        return model.state as T;
      }
      const methodName = map.get(action.type);
      if (!methodName) return model.state as T;
      beforeReducerHook(state, action, model);
      const reducer = Reflect.get(model, methodName);
      const newState = reducer.call(model, action.payload, model.state, action);
      afterReducerHook(newState, action, model);
      return newState ?? model.state;
    },
  );
}
