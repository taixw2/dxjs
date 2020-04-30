/* eslint-disable @typescript-eslint/no-explicit-any */
import { DxFactory, DxFactoryInterface } from '../..';
import { ExampleModel } from '../../../../__tests__/example-model';
import { createEffectContext } from '../create-effect-context';
import { Disguiser } from '../../../dx-model/disguiser';
import { DisguiserInterface } from '@dxjs/shared/interfaces/dx-disguiser.interface';
import { Guard } from '../../../dx-model/guard';
import { GuardInterface } from '@dxjs/shared/interfaces/dx-guard.interface';

describe('create effect context', () => {
  let Dx: DxFactoryInterface;
  beforeEach(() => {
    Dx = DxFactory();
  });

  it('create effect context: 空的增强器', () => {
    Dx.createStore({
      sentinels: [],
      disguisers: [],
      guards: [],
    });

    const createContext = createEffectContext(Dx.inst!, new ExampleModel(), {
      name: 'test',
      helperType: 'te',
      actionType: 'x',
    });

    expect(typeof createContext).toBe('function');
    const context = createContext({ type: 'x', payload: '' });

    expect(context.disguisers).toEqual([]);
    expect(context.sentinels).toEqual([]);
    expect(context.guards).toEqual([]);
  });

  it('create effect context: 增强器', () => {
    const mock1 = jest.fn();
    const mock2 = jest.fn();

    async function functionBaseEnhancer(): Promise<true> {
      mock1();
      return true;
    }

    class ClassBaseEnhancer extends Disguiser implements DisguiserInterface {
      *disguiser(): Generator {
        return;
      }
    }

    class ClassBaseEnhancerWithGuard extends Guard implements GuardInterface {
      async guard(): Promise<void> {
        mock2();
        return;
      }
    }

    Dx.createStore({
      sentinels: [functionBaseEnhancer],
      disguisers: [ClassBaseEnhancer],
      guards: [{ include: 'include', enhancer: ClassBaseEnhancerWithGuard }],
    });

    const createContext = createEffectContext(Dx.inst!, new ExampleModel(), {
      name: 'test',
      helperType: 'te',
      actionType: 'x',
    });

    expect(typeof createContext).toBe('function');
    const context = createContext({ type: 'x', payload: '' });

    expect(context.disguisers).toEqual([ClassBaseEnhancer]);

    context.sentinels[0]({} as any);

    expect(mock1.mock.calls.length).toBe(1);

    // ExampleModel 没有 label, 无法匹配 include
    expect(context.guards.length).toBe(0);
  });
});
