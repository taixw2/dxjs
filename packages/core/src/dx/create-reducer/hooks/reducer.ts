import { store } from '../../../helper/store';
import { Reducer } from 'redux';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ReducerEnhancer<T = any> = (reducer: Reducer) => T;

type reducerFn = (f: Reducer) => Reducer;

export function reducerHook(): ReducerEnhancer {
  // 全局的，本地的
  const reducerHooks = store.plugins.get('reducer') as reducerFn[];
  if (!reducerHooks || !reducerHooks.length) return (f: Reducer): Reducer => f;
  return reducerHooks.reduce((a: ReducerEnhancer, b: ReducerEnhancer) => {
    return (reducer: Reducer): Reducer => a(b(reducer));
  });
}
