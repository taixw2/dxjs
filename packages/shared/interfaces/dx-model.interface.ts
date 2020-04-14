/* eslint-disable @typescript-eslint/no-explicit-any */
import { DxBaseInterface } from './dx-base.interface';
import { Reducer, Action } from 'redux';

export interface DxModelInterface<T = any> extends DxBaseInterface {
  [key: string]: Reducer | any;
  state: T;
}

type DxAction = <T>(payload: T) => Action<T>;
type DxActionAutoDispatch = <T>(payload: T, autodDispatch: boolean) => void;

export interface DxModelContstructor {
  new (...props: any[]): DxModelInterface;

  [action: string]: DxAction | DxActionAutoDispatch;
}
