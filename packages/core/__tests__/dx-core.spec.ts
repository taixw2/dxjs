import * as React from 'react';
import { DxFactory } from '../src';
import { DxModelContstructor } from '@dxjs/shared/interfaces/dx-model.interface';
import { ExampleModel } from './example-model';
import { Dx } from '../src/dx';
import { AnyAction } from 'redux';

describe('Dx core', () => {
  const ExampleModelStatic: DxModelContstructor = ExampleModel;

  it('多个 Dx 实例', () => {
    const _Dx1 = DxFactory();
    const _Dx2 = DxFactory();

    _Dx1.createStore();
    _Dx2.createStore();

    _Dx1.collect()(ExampleModelStatic);
    _Dx1.collect()(ExampleModelStatic);

    // 相同实例不会重复添加同一个
    expect(Object.keys(_Dx1.getModels() ?? {}).length).toBe(1);
    expect(Object.keys(_Dx2.getModels() ?? {}).length).toBe(0);
    _Dx2.collect()(ExampleModelStatic);
    expect(Object.keys(_Dx2.getModels() ?? {}).length).toBe(1);
  });

  it('Dx.getModels', () => {
    Dx.createStore();
    Dx.collect('example')(ExampleModelStatic);

    expect(Dx.getModels()).toHaveProperty('example');
    expect(Dx.getModels('exa')).toBe(ExampleModelStatic);
    expect(Dx.getModels('example')).toBe(ExampleModelStatic);
    expect(Dx.getModels(/^exa/)[0]).toBe(ExampleModelStatic);
  });

  it('Dx.createStore', () => {
    const store = Dx.createStore();
    const mockSubscribe = jest.fn();
    expect(
      [store.dispatch, store.getState, store.replaceReducer, store.subscribe].every(
        f => typeof f === 'function',
      ),
    ).toBe(true);

    store.subscribe(mockSubscribe);
    store.replaceReducer((state = {}, action: AnyAction) => {
      return { ...state, ...action.payload };
    });

    const payload = { a: 1 };
    expect(mockSubscribe.mock.calls.length).toBe(1);
    store.dispatch({ type: '', payload });
    expect(mockSubscribe.mock.calls.length).toBe(2);
    const nextState = store.getState();
    expect(nextState).toMatchObject(payload);
  });

  it('Dx.create', () => {
    const DxApp = Dx.create();
    expect(typeof DxApp).toBe('function');
    expect(React.isValidElement(DxApp({}))).toBe(true);
  });

  it('Dx.collect', () => {
    Dx.collect('example')(ExampleModelStatic);
    expect(Dx.getModels('example')).toBe(ExampleModelStatic);
  });
});
