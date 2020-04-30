import { BaseSentinelInterface } from '@dxjs/shared/interfaces/dx-sentinel.interface';
import { AnyAction } from 'redux';
import { BaseEffectContextInterface } from '@dxjs/shared/interfaces/dx-effect-context.interface';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class Sentinel<T extends AnyAction = any> implements BaseSentinelInterface<T> {
  constructor(private context: BaseEffectContextInterface<T>) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getState(): any {
    return this.context.getState();
  }

  getPayload(): T['payload'] {
    return this.context.action.payload;
  }

  dispatchCurrentAction<P>(payload?: P): T {
    const action = {
      ...this.context.action,
      payload: typeof payload === 'undefined' ? this.context.action.payload : payload,
    };
    this.context.dispatch(action);

    return action;
  }
}
