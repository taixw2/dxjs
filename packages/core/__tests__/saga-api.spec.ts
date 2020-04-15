/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dx, DxModel, DxFactory } from '../src';
import { DxModelContstructor } from '@dxjs/shared/interfaces/dx-model.interface';
import { Effect } from '../../common/src';
import {
  call,
  put,
  putResolve,
  apply,
  cps,
  fork,
  spawn,
  join,
  cancel,
  select,
  delay,
  retry,
  all,
  race,
} from 'redux-saga/effects';
import { channel, Channel, Task } from 'redux-saga';

describe('测试支持 saga 的 API', () => {
  let _Dx = Dx;
  let ExampleModelStatic: DxModelContstructor;

  function none(): void {
    //
  }

  const context = {
    call(): void {
      //
    },
  };

  beforeEach(() => {
    _Dx = DxFactory();
  });

  afterEach(() => {
    _Dx.collect('example')(ExampleModelStatic);
    _Dx.createStore();
    Object.keys(ExampleModelStatic).forEach((key: string) => {
      if (typeof ExampleModelStatic[key] === 'function') {
        ExampleModelStatic[key]('payload', true);
      }
    });
  });

  it('call', () => {
    class ExampleModel extends DxModel {
      @Effect()
      *calcalcal(): Generator {
        expect(this.$call(none)).toMatchObject(call(none));
        expect(this.$call([context, none])).toMatchObject(call([context, none]));
        expect(this.$call({ context, fn: none })).toMatchObject(call({ context, fn: none }));
      }
    }
    ExampleModelStatic = ExampleModel;
  });

  it('put', () => {
    class ExampleModel extends DxModel {
      @Effect()
      *normalPut(): Generator {
        const action = { type: '__mock_action_type' };
        expect(this.$put(action)).toMatchObject(put(action));
        expect(this.$put('resolve', action)).toMatchObject(putResolve(action));
        const chan = yield this.$call(channel);
        expect(this.$put(chan as Channel<any>, action)).toMatchObject(
          put(chan as Channel<any>, action),
        );
      }
    }
    ExampleModelStatic = ExampleModel;
  });

  it('apply', () => {
    class ExampleModel extends DxModel {
      @Effect()
      *normalPut(): Generator {
        expect(this.$apply(context, none, [])).toMatchObject(apply(context, none, []));
        expect(this.$apply(context, 'call', [])).toMatchObject(apply(context, 'call', []));
      }
    }
    ExampleModelStatic = ExampleModel;
  });

  it('cps', () => {
    class ExampleModel extends DxModel {
      @Effect()
      *normalPut(): Generator {
        expect(this.$cps(none)).toMatchObject(cps(none));
        expect(this.$cps([context, 'call'])).toMatchObject(cps([context, 'call']));
        expect(this.$cps({ context, fn: 'call' })).toMatchObject(cps({ context, fn: 'call' }));
        expect(this.$cps({ context, fn: none })).toMatchObject(cps({ context, fn: none }));
      }
    }
    ExampleModelStatic = ExampleModel;
  });

  it('fork', () => {
    class ExampleModel extends DxModel {
      @Effect()
      *normalPut(): Generator {
        expect(this.$fork(none)).toMatchObject(fork(none));
        expect(this.$fork([context, 'call'])).toMatchObject(fork([context, 'call']));
        expect(this.$fork({ context, fn: 'call' })).toMatchObject(fork({ context, fn: 'call' }));
        expect(this.$fork({ context, fn: none })).toMatchObject(fork({ context, fn: none }));
      }
    }
    ExampleModelStatic = ExampleModel;
  });

  it('spawn', () => {
    class ExampleModel extends DxModel {
      @Effect()
      *normalPut(): Generator {
        expect(this.$spawn(none)).toMatchObject(spawn(none));
        expect(this.$spawn([context, 'call'])).toMatchObject(spawn([context, 'call']));
        expect(this.$spawn({ context, fn: 'call' })).toMatchObject(spawn({ context, fn: 'call' }));
        expect(this.$spawn({ context, fn: none })).toMatchObject(spawn({ context, fn: none }));
      }
    }
    ExampleModelStatic = ExampleModel;
  });

  it('join', () => {
    class ExampleModel extends DxModel {
      @Effect()
      *normalPut(): Generator {
        const _take = yield fork(none);
        expect(this.$join(_take as Task)).toMatchObject(join(_take as Task));
        expect(this.$join([_take] as Task[])).toMatchObject(join([_take] as Task[]));
      }
    }
    ExampleModelStatic = ExampleModel;
  });

  it('cancel', () => {
    class ExampleModel extends DxModel {
      @Effect()
      *normalPut(): Generator {
        const _take = yield fork(none);
        expect(this.$cancel(_take as Task)).toMatchObject(cancel(_take as Task));
        expect(this.$cancel([_take] as Task[])).toMatchObject(cancel([_take] as Task[]));
      }
    }
    ExampleModelStatic = ExampleModel;
  });

  it('select', () => {
    class ExampleModel extends DxModel {
      @Effect()
      *normalPut(): Generator {
        expect(this.$select(none)).toMatchObject(select(none));
        expect(this.$select()).toMatchObject(select());
      }
    }
    ExampleModelStatic = ExampleModel;
  });

  it('delay', () => {
    class ExampleModel extends DxModel {
      @Effect()
      *normalPut(): Generator {
        expect(this.$delay(1, '')).toMatchObject(delay(1, ''));
      }
    }
    ExampleModelStatic = ExampleModel;
  });

  it('retry', () => {
    class ExampleModel extends DxModel {
      @Effect()
      *normalPut(): Generator {
        expect(this.$retry(10, 10, none)).toMatchObject(retry(10, 10, none));
      }
    }
    ExampleModelStatic = ExampleModel;
  });

  it('all', () => {
    class ExampleModel extends DxModel {
      @Effect()
      *normalPut(): Generator {
        expect(this.$all([none])).toMatchObject(all([none]));
        expect(this.$all(context)).toMatchObject(all(context));
      }
    }
    ExampleModelStatic = ExampleModel;
  });

  it('race', () => {
    class ExampleModel extends DxModel {
      @Effect()
      *normalPut(): Generator {
        expect(this.$race([none])).toMatchObject(race([none]));
        expect(this.$race(context)).toMatchObject(race(context));
      }
    }
    ExampleModelStatic = ExampleModel;
  });
});
