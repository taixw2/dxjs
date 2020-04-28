/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseGuardInterface } from '@dxjs/shared/interfaces/dx-guard.interface';
import { AnyAction } from 'redux';
import { BaseEffectContextInterface } from '@dxjs/shared/interfaces/dx-effect-context.interface';

export class Guard<T extends AnyAction> implements BaseGuardInterface<T> {
  constructor(private option: BaseEffectContextInterface<T>) {}

  getState(): any {
    return this.option.getState();
  }

  dispatchCurrentAction(): T {
    // TODO dispatch 无法获取
    return this.option.action;
  }

  getPayload(): T['payload'] {
    return this.option.action['payload'];
  }
}
