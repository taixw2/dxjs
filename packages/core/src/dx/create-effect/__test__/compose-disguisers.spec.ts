import { composeDisguiser } from '../compose-disguisers';
import { EffectContextInterface } from '@dxjs/shared/interfaces/dx-effect-context.interface';
import { Dx } from '../..';
import { Disguiser } from '../../../dx-model/disguiser';
import { DisguiserInterface } from '@dxjs/shared/interfaces/dx-disguiser.interface';

describe('compose disguisers', () => {
  let mockContext: EffectContextInterface;

  function* effect(): Generator {
    yield 1;
    yield 2;
    yield 3;
    throw '4';
  }

  beforeEach(() => {
    const store = Dx.createStore();
    mockContext = {
      action: '',
      dispatch: store.dispatch,
      getState: store.getState,
      meta: { name: '', actionType: '', helperType: '' },
      guards: [],
      inst: Dx.inst!,
      disguisers: [],
      sentinels: [],
    };
  });

  it('传入空的 disguisers', () => {
    const gen = composeDisguiser(mockContext)(effect());

    expect(gen.next().value).toBe(1);
    expect(gen.next().value).toBe(2);
    expect(gen.next().value).toBe(3);
  });

  it('添加一个 disguisers ', () => {
    class MockDisguiser extends Disguiser implements DisguiserInterface {
      *disguiser(): Generator {
        //
      }
    }
    mockContext.disguisers.push(MockDisguiser);
    const gen = composeDisguiser(mockContext)(effect());
    expect(gen.next().value).toBe(1);
    expect(gen.next().value).toBe(2);
    expect(gen.next().value).toBe(3);
  });

  it('disguisers 中断 effect 的能力 ', () => {
    class MockDisguiser extends Disguiser implements DisguiserInterface {
      *disguiser(): Generator {
        yield this.abort();
      }
    }
    mockContext.disguisers.push(MockDisguiser);
    const gen = composeDisguiser(mockContext)(effect());

    // 执行 disguiser
    gen.next();

    expect(gen.next().done).toBe(true);
  });

  it('disguisers 控制 effect 的 next ', () => {
    const mockFn = jest.fn();

    class MockDisguiser extends Disguiser implements DisguiserInterface {
      *disguiser(): Generator {
        yield 0;
        yield this.next();
        yield 1.1;
        yield this.next();
        yield 2.1;
        yield this.next();
        yield 3.1;
        try {
          yield this.next();
        } catch (error) {
          mockFn(error);
        }
      }
    }
    mockContext.disguisers.push(MockDisguiser);
    const gen = composeDisguiser(mockContext)(effect());

    expect(gen.next().value).toBe(0);
    expect(gen.next().value).toBe(1);
    expect(gen.next().value).toBe(1.1);
    expect(gen.next().value).toBe(2);
    expect(gen.next().value).toBe(2.1);
    expect(gen.next().value).toBe(3);
    expect(gen.next().value).toBe(3.1);
    gen.next();
    expect(mockFn.mock.calls.length).toBe(1);
    expect(mockFn.mock.calls[0]).toEqual(['4']);
  });
});
