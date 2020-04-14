/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { LABEL, REDUCER_METHODS_KEY, REDUCER_ENHANCER_KEY } from '@dxjs/shared/symbol';
import { Action, Reducer } from 'redux';
import { DxModelInterface } from '@dxjs/shared/interfaces/dx-model.interface';
import { EnhancerFilter, Enhancer } from '@dxjs/shared/interfaces/dx-enhancer.interface';
import { ReducerEnhancer } from '@dxjs/shared/interfaces/dx-reducer-enhancer.interface';
import { store } from '../helper/store';

export function createReducer(model: DxModelInterface, inst: symbol): Reducer {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const enhance = store.enhancer.get(inst)!;
  const Model = model.constructor;

  const modelLabels: string[] = Reflect.getMetadata(LABEL, Model) || [];
  const reducerEnhancerFilter = enhance.reducerEnhancer!.filter(
    (enhancer: Enhancer<ReducerEnhancer>): boolean => {
      const _enhancer = enhancer as EnhancerFilter<ReducerEnhancer>;
      if (_enhancer.include === '*') {
        return true;
      }
      if (typeof _enhancer.include === 'string') {
        return modelLabels.some(label => label === _enhancer.include);
      }
      if (_enhancer.include instanceof RegExp) {
        return modelLabels.some(label => (_enhancer.include as RegExp).test(label));
      }
      if (typeof _enhancer.exclude === 'string') {
        return !modelLabels.some(label => label === _enhancer.exclude);
      }
      if (_enhancer.exclude instanceof RegExp) {
        return !modelLabels.some(label => (_enhancer.exclude as RegExp).test(label));
      }
      return false;
    },
  );

  const reducerEnhancer = reducerEnhancerFilter
    .map(
      (enhancer: Enhancer<ReducerEnhancer>) =>
        (enhancer as EnhancerFilter<ReducerEnhancer>).enhancer,
    )
    .reduce((a: ReducerEnhancer, b: ReducerEnhancer) => {
      return (reducer: Reducer): Reducer => a(b(reducer));
    });

  /**
   * 全局的增强器在项目运行时就会执行，切只执行一遍
   * 局部的增强器每次
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return reducerEnhancer((state: any, action: Action) => {
    model.state = state;
    const methodName = (Reflect.getMetadata(REDUCER_METHODS_KEY, Model) as Map<symbol, string>).get(
      action.type,
    );

    if (!methodName) return state;
    const enhances: ReducerEnhancer[] =
      Reflect.getMetadata(REDUCER_ENHANCER_KEY, Model, methodName) ?? [];
    const originReducer = model[methodName] as Reducer;

    const currentState = enhances
      .reduce((a: ReducerEnhancer, b: ReducerEnhancer) => a(b))(originReducer)
      .call(model, state, action);

    if (!currentState) return model.state;
    return currentState;
  });
}

// @Reducer
// 生成一个 Symbol
// 把这个 Symbol 和 对应的方法关联起来.
