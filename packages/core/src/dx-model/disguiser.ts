/* eslint-disable @typescript-eslint/no-explicit-any */
import { DxBase } from './base';
import { DisguiserBaseInterface } from '@dxjs/shared/interfaces/dx-disguiser.interface';
import { AnyAction } from 'redux';
import { DISGUISER_IO, DISGUISER_ABORT, DISGUISER_NEXT } from '@dxjs/shared/symbol';
import { BaseEffectContextInterface } from '@dxjs/shared/interfaces/dx-effect-context.interface';
import { mix } from '../helper/mixins';
import { BaseEffect } from './base-effect';

export class Disguiser<T extends AnyAction = any>
  extends (mix(DxBase, BaseEffect) as { new (context: BaseEffectContextInterface<any>): DxBase & BaseEffect })
  implements DisguiserBaseInterface<T> {
  constructor(context: BaseEffectContextInterface<T>) {
    super(context);
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
}
