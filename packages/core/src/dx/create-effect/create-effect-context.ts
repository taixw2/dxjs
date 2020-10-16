/* eslint-disable @typescript-eslint/no-explicit-any */
import { store } from '../../helper/store';
import { AnyAction } from 'redux';
import { DxModel } from '../../dx-model/model';
import { EffectTypeInterface } from './index';

export interface BaseEffectContextInterface<T> {
  action: T;

  dispatch: (action: AnyAction) => AnyAction | void;

  meta: EffectTypeInterface;

  getState: () => any;

  [key: string]: any;
}

export function createEffectContext<T>(model: DxModel, meta: EffectTypeInterface, action: T): BaseEffectContextInterface<T> {
  return {
    meta,
    action,
    model,
    getState: (): unknown => store?.reduxStore?.getState(),
    dispatch: (action: AnyAction) => store?.reduxStore?.dispatch(action),
  };
}
