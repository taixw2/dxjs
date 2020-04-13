/* eslint-disable @typescript-eslint/no-explicit-any */
import { DxBaseInterface } from './dx-base.interface';
import { Reducer } from 'redux';

export interface DxModelInterface<T = any> extends DxBaseInterface {
  [key: string]: Reducer | any;
  state: T;
}

export interface DxModelContstructor {
  new (...props: any[]): DxModelInterface;
}
