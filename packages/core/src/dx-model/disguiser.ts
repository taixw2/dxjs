import { DxBase } from './base';
import { DisguiserBaseInterface } from '@dxjs/shared/interfaces/dx-disguiser.interface';
import { AnyAction } from 'redux';
import { DISGUISER_IO, DISGUISER_ABORT, DISGUISER_NEXT } from '@dxjs/shared/symbol';
import { EffectContextInterface } from '@dxjs/shared/interfaces/dx-effect-context.interface';

export class Disguiser<T extends AnyAction> extends DxBase implements DisguiserBaseInterface<T> {
  constructor(private context: EffectContextInterface<T>) {
    super();
  }

  private createEffect<T>(type: string): T {
    return ({ [DISGUISER_IO]: true, type } as unknown) as T;
  }

  abort(): void {
    return this.createEffect(DISGUISER_ABORT);
  }

  next(): void {
    return this.createEffect(DISGUISER_NEXT);
  }

  getPayload(): T['payload'] {
    return this.context.action.payload;
  }

  dispatchCurrentAction(): T {
    this.context.dispatch(this.context.action);
    return this.context.action;
  }
}
