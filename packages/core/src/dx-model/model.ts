/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSelector } from 'react-redux';
import { DxActionCreate } from '../dx/create-action';
import { DxBase } from './base';

export interface DxModelContstructor<T extends DxModel> {
  new (): DxModel;
  namespace: string;

  patch: DxActionCreate<T['state']>;
}

export class DxModel<S = {}> extends DxBase {
  state = {} as S;
  init() {}

  // 内置的 reducer
  patch(payload: S) {
    Object.assign(this.state, payload);
  }

  // 内置的静态方法
  static namespace: string;

  static selector() {
    return (state: any) => state[this.namespace];
  }

  static useSelector() {
    return useSelector(this.selector);
  }
}

export function isDxModel<T extends DxModel>(model: any): model is DxModelContstructor<T> {
  return model && model.prototype instanceof DxModel;
}

export function DxModelGeneratory<T extends DxModel>(): DxModelContstructor<T> {
  return (DxModel as unknown) as DxModelContstructor<T>;
}
