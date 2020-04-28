import { DxBase } from './base';
import { SpyBaseInterface } from '@dxjs/shared/interfaces/dx-spy.interface';
import { AnyAction } from 'redux';

export class Spy<T extends AnyAction> extends DxBase implements SpyBaseInterface<T> {
  private createEffect<T>(type: string): T {
    return ({ '@dxjs/IO': true, type } as unknown) as T;
  }

  abort(): void {
    return this.createEffect('abort');
  }

  next(): void {
    return this.createEffect('next');
  }

  getPayload(): T['payload'] {
    return this.createEffect('payload');
  }

  dispatchCurrentAction(): T {
    return this.createEffect('dispatch');
  }
}
