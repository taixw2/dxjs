/* eslint-disable @typescript-eslint/no-explicit-any */

import { Dispatch } from 'react';
import { EffectTypeInterface } from './dx-effect-type.interface';
import { DisguiserStatic } from './dx-disguiser.interface';
import { EnhancerFunctionSupportInterface } from './dx-effect-support.interface';

export interface BaseEffectContextInterface<T> {
  action: T;

  dispatch: Dispatch<any>;

  inst: symbol;

  meta: EffectTypeInterface;

  getState: () => any;

  [key: string]: any;
}

export interface EffectContextInterface<T = any> extends BaseEffectContextInterface<T> {
  sentinels: EnhancerFunctionSupportInterface[];

  guards: EnhancerFunctionSupportInterface[];

  disguisers: DisguiserStatic[];
}
