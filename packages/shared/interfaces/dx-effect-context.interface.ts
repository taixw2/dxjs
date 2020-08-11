/* eslint-disable @typescript-eslint/no-explicit-any */

import { Dispatch } from 'react';
import { EffectTypeInterface } from './dx-effect-type.interface';

export interface BaseEffectContextInterface<T> {
  action: T;

  dispatch: Dispatch<any>;

  meta: EffectTypeInterface;

  getState: () => any;

  [key: string]: any;
}
