/* eslint-disable @typescript-eslint/no-explicit-any */
import { AnyAction } from 'redux';
import { BaseEffectContextInterface } from '@dxjs/shared/interfaces/dx-effect-context.interface';

export class BaseEffect<T extends AnyAction = any> {
  constructor(private context: BaseEffectContextInterface<T>) {}

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
