/* eslint-disable @typescript-eslint/no-explicit-any */
import { AnyAction } from 'redux';

export class BaseEffect<T extends AnyAction = any> {
  constructor(private context: any) {}

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
