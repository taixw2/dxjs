/* eslint-disable @typescript-eslint/no-explicit-any */
import { DxBaseInterface } from './dx-base.interface';
import { Reducer, Action } from 'redux';

export interface DxModelInterface<T = any> extends DxBaseInterface {
  state: T;

  init?(): void;

  [key: string]: Reducer | any;
}

type DxAction = <T>(payload: T) => Action<T>;
type DxActionAutoDispatch = <T>(payload: T, autodDispatch: boolean) => void;

export interface DxModelContstructor<T = any> {
  new (...props: any[]): DxModelInterface<T>;

  [action: string]: DxAction | DxActionAutoDispatch | any;
}
