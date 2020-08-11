import { store } from '../../../helper/store';
import { ReducerEnhancer } from '@dxjs/shared/interfaces/dx-reducer-enhancer.interface';
import { Reducer } from 'redux';

type reducerFn = (f: Reducer) => Reducer;

export function reducerHook(): ReducerEnhancer {
  // 全局的，本地的
  const reducerHooks = store.plugins.get('reducer') as reducerFn[];
  if (!reducerHooks || !reducerHooks.length) return (f: Reducer): Reducer => f;
  return reducerHooks.reduce((a: ReducerEnhancer, b: ReducerEnhancer) => {
    return (reducer: Reducer): Reducer => a(b(reducer));
  });
}
