/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseGuardInterface } from '@dxjs/shared/interfaces/dx-guard.interface';
import { AnyAction } from 'redux';
import { BaseEffectContextInterface } from '@dxjs/shared/interfaces/dx-effect-context.interface';

export class Guard<T extends AnyAction = any> implements BaseGuardInterface<T> {
  constructor(private context: BaseEffectContextInterface<T>, private error?: Error, private data?: unknown) {}

  getState(): any {
    return this.context.getState();
  }

  dispatchCurrentAction(): T {
    // TODO dispatch 无法获取
    return this.context.action;
  }

  getPayload(): T['payload'] {
    return this.context.action['payload'];
  }

  getData(): unknown {
    return this.data;
  }

  getError(): unknown {
    return this.error;
  }
}
