/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseGuardInterface } from '@dxjs/shared/interfaces/dx-guard.interface';
import { AnyAction } from 'redux';
import { BaseEffectContextInterface } from '@dxjs/shared/interfaces/dx-effect-context.interface';
import { BaseEffect } from './base-effect';

export class Guard<T extends AnyAction = any> extends BaseEffect implements BaseGuardInterface<T> {
  constructor(context: BaseEffectContextInterface<T>, private error?: Error, private data?: unknown) {
    super(context);
  }

  getData(): unknown {
    return this.data;
  }

  getError(): unknown {
    return this.error;
  }
}
