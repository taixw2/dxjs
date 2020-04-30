import { combinStore } from '../create-store/create-store';
import { createStore, applyMiddleware, Action } from 'redux';
import { promiseMiddleware } from '../create-store/promise-middleware';
import { store } from '../../helper/store';
import { createEnhancer } from '../../helper/create-enhancer';

describe('create store', () => {
  //
  it('create enhancer: 传入不同形式的 enhancer 均返回标准结构', () => {
    const enhancer = (): void => void 0;
    expect(createEnhancer([enhancer, { enhancer: enhancer, exclude: 'user' }])).toEqual([
      {
        include: '*',
        enhancer: enhancer,
      },
      {
        include: '*',
        enhancer: enhancer,
        exclude: 'user',
      },
    ]);
  });

  it('create redux store: 返回一个 redux store', () => {
    const store = combinStore(Symbol(''), {});
    expect(store.dispatch).not.toBeUndefined();
    expect(store.getState).not.toBeUndefined();
    expect(store.replaceReducer).not.toBeUndefined();
    expect(store.subscribe).not.toBeUndefined();
  });

  it('redux promise middleware: 在 effect 中的 action 返回一个 promise, 否则返回 action', () => {
    const inst = Symbol();
    const mockType = '__mockType__';
    const mockType2 = '__mockType__2';
    const istore = createStore(f => f, applyMiddleware(promiseMiddleware(inst)));
    store.actionTypes.set(inst, { effects: new Set([mockType]), reducers: new Set([]) });
    expect(((istore.dispatch({ type: mockType }) as unknown) as Promise<Action>).then).not.toBeUndefined();
    expect(istore.dispatch({ type: mockType2 })).toEqual({ type: mockType2 });
  });
});
