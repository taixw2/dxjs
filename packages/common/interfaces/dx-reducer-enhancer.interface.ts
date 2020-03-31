import { Reducer } from 'redux';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ReducerEnhancer<T = any> = (reducer: Reducer) => T;
