/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSelector } from 'react-redux';
import { Reducer } from '../../../common';
import { DxActionCreate } from '../dx/create-action';
import { DxBase } from './base';

export interface DxModelContstructor {
  new (): DxModel;
}

export class DxModel<S = {}> extends DxBase {
  static namespace: string = Math.random().toString(); // 用户没有设置，就使用随机的 namespace

  static patch: DxActionCreate;

  static selector<T>() {
    return (state: any) => state[this.namespace] as T;
  }

  static useSelector<T>() {
    return useSelector<T>(this.selector);
  }

  static action(actionType: string, payload: any) {
    (this as any)[actionType]?.(payload);
  }

  init?: () => void;
  state = {} as S;

  // 内置的 reducer
  @Reducer()
  patch(payload: S) {
    Object.assign(this.state, payload);
    return this.state;
  }
}

export function isDxModel(model: any): model is DxModelContstructor {
  return model && model.prototype instanceof DxModel;
}
