import { createAction } from '../src/dx/create-action';
import { Dx } from '../src/dx';
import { Store, Reducer } from 'redux';
import { store } from '../src/helper/store';
import { ExampleModel } from './example-model';
import { DxModelContstructor } from '@dxjs/shared/interfaces/dx-model.interface';
import { createReducer } from '../src/dx/create-reducer';
import { createEffect } from '../src/dx/create-effect';
import { all, spawn } from 'redux-saga/effects';

describe('dx recombin', () => {
  let reduxStore: Store;
  const inst = Symbol('__mock_inst');

  const ExampleModelStatic: DxModelContstructor = ExampleModel;
  beforeEach(() => {
    reduxStore = Dx.createStore();
    store.models.set(inst, {
      map: { example: ExampleModelStatic },
      set: new Set([ExampleModelStatic]),
    });
  });

  it('create Action', () => {
    createAction(inst, reduxStore.dispatch);
    expect(['updateCount', 'asyncUpdateCount'].every(k => Reflect.has(ExampleModelStatic, k))).toBe(true);
    expect(ExampleModelStatic.updateCount('payload_data')).toMatchObject({
      payload: 'payload_data',
    });
    expect(ExampleModelStatic.asyncUpdateCount('payload_data')).toMatchObject({
      payload: 'payload_data',
    });
  });

  it('create reducer', () => {
    const mockFn = jest.fn();
    function mockReducerEnhancer(reducer: Reducer): Reducer {
      mockFn();
      return reducer;
    }

    store.enhancer.set(inst, {
      reducerEnhancer: [{ include: '*', enhancer: mockReducerEnhancer }],
    });

    const model = new ExampleModelStatic();
    const reducer = createReducer(inst, model);

    expect(reducer).not.toBeUndefined();
    if (!reducer) return;
    const state = reducer({ count: 3 }, { type: 'ns/count', payload: 2 });
    expect(state).toMatchObject({ count: 5 });
    expect(mockFn.mock.calls.length).toBe(1);
  });

  it('create saga', () => {
    const model = new ExampleModelStatic();

    const effect = createEffect(inst, model);
    expect(effect).not.toBeUndefined();
    if (!effect) return;
    const gen = effect();
    expect(typeof gen.next).toBe('function');

    const allEffect = gen.next().value;
    const fnRefs = allEffect.payload.map((v: any) => spawn(v.payload.fn));

    expect(allEffect).toMatchObject(all(fnRefs));
  });
});
