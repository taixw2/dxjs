import { store } from '../../helper/store';
import { DxModelContstructor } from '@dxjs/shared/interfaces/dx-model.interface';
import { enhancerFilter } from '../../helper/enhancer-filter';
import { ReducerEnhancer } from '@dxjs/shared/interfaces/dx-reducer-enhancer.interface';
import { Reducer } from 'redux';
import { EnhancerFilter } from '@dxjs/shared/interfaces/dx-enhancer.interface';

export function combinEnhancer(Model: DxModelContstructor, inst: symbol): ReducerEnhancer {
  const enhance = store.enhancer.get(inst)!;
  const reducerEnhancers = enhancerFilter(Model, enhance.reducerEnhancer as EnhancerFilter<ReducerEnhancer>[]);
  if (!reducerEnhancers.length) return (f: Reducer): Reducer => f;
  return reducerEnhancers
    .map(enhancer => enhancer.enhancer)
    .reduce((a: ReducerEnhancer, b: ReducerEnhancer) => {
      return (reducer: Reducer): Reducer => a(b(reducer));
    });
}
