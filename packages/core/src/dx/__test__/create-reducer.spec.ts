import { ExampleModel } from '../../../__tests__/example-model';
import { DxFactory, DxFactoryInterface } from '..';
import { combinEnhancer } from '../create-reducer/combin-enhancer';
import { Reducer } from 'redux';
import { store } from '../../helper/store';
import { combinReducer } from '../create-reducer/combin-reducer';
import { REDUCER_METHODS_KEY } from '@dxjs/shared/symbol';

describe('create reducer', () => {
  const ExampleModelStatic = ExampleModel;

  let _Dx: DxFactoryInterface;
  const mockFn = jest.fn();
  beforeEach(() => {
    function mockReducerEnhancer(reducer: Reducer): Reducer {
      mockFn();
      return reducer;
    }

    _Dx = DxFactory();
    _Dx.collect()(ExampleModelStatic);
    store.enhancer.set(_Dx.inst!, {
      reducerEnhancer: [
        { enhancer: mockReducerEnhancer, include: '*' },
        { enhancer: mockReducerEnhancer, include: '*' },
        { enhancer: mockReducerEnhancer, include: 'user' },
      ],
    });
  });

  it('combinEnhancer: combin 不会调用任意的 enhancer', () => {
    const reducerEnhancer = combinEnhancer(ExampleModelStatic, _Dx.inst!);
    expect(mockFn.mock.calls.length).toBe(0);
    const reducer = reducerEnhancer((state = 0) => {
      return state + 10;
    });

    // 只会调用匹配 include 的两个
    expect(mockFn.mock.calls.length).toBe(2);
    expect(reducer(20)).toBe(30);
  });

  it('combinEnhancer: 创建 reducer 之后会用 enhancer 包裹，此时执行 enhancer', () => {
    const reducerEnhancer = combinEnhancer(ExampleModelStatic, _Dx.inst!);
    function reducer(state: number): number {
      return state + 10;
    }
    const newReducer = reducerEnhancer(reducer);
    expect(newReducer(20)).toBe(30);
  });

  it('combinEnhancer: 通过 include 与 exclude 过滤 reducer', () => {
    const reducerEnhancer = combinEnhancer(ExampleModelStatic, _Dx.inst!);
    function reducer(state: number): number {
      return state + 10;
    }
    reducerEnhancer(reducer);
    expect(mockFn.mock.calls.length).toBe(2);
  });

  it('combinReducer: 传入 action type， 调用 model 方法', () => {
    const reducers = Reflect.getMetadata(REDUCER_METHODS_KEY, ExampleModelStatic);
    const reducer = combinReducer(new ExampleModelStatic(), reducers);
    // ns/count 与 state 均在 ExampleModel 中定义
    expect(reducer(undefined, { type: 'ns/count', payload: 20 })).toEqual({ count: 21 });
  });
});
