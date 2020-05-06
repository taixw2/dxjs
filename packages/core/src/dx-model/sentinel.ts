import { BaseSentinelInterface } from '@dxjs/shared/interfaces/dx-sentinel.interface';
import { AnyAction } from 'redux';
import { BaseEffectContextInterface } from '@dxjs/shared/interfaces/dx-effect-context.interface';
import { BaseEffect } from './base-effect';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class Sentinel<T extends AnyAction = any> extends BaseEffect implements BaseSentinelInterface<T> {
  constructor(context: BaseEffectContextInterface<T>) {
    super(context);
  }
}
