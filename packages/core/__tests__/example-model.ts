import { DxModel } from '../src';
import { DxModelInterface, DxModelContstructor } from '@dxjs/shared/interfaces/dx-model.interface';
import { Reducer, Effect } from '../../common/src';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function delayGet<T = any>(value: T): Promise<T> {
  return new Promise(resolve => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setTimeout(() => resolve(value || ((10 as unknown) as any)), 1000);
  });
}

export class ExampleModel extends DxModel implements DxModelInterface {
  state = { count: 1 };

  @Reducer('ns/count')
  coustActionReducer(count: number): void {
    this.state.count += count;
  }

  @Reducer()
  updateCount(count: number): void {
    this.state.count += count;
  }

  @Effect()
  *asyncUpdateCount(payload: number): Generator {
    const count = yield this.$call(delayGet, payload);
    yield this.$put((ExampleModel as DxModelContstructor).updateCount(count));
  }
}
