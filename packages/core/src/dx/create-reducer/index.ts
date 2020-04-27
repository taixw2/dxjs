/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { REDUCER_METHODS_KEY } from '@dxjs/shared/symbol';
import { Reducer } from 'redux';
import { DxModelInterface, DxModelContstructor } from '@dxjs/shared/interfaces/dx-model.interface';
import { combinEnhancer } from './combin-enhancer';
import { combinReducer } from './combin-reducer';

export function createReducer(inst: symbol, model: DxModelInterface): Reducer | void {
  const Model = model.constructor as DxModelContstructor;
  const reducers = Reflect.getMetadata(REDUCER_METHODS_KEY, Model);
  if (!reducers) return;
  const reducerEnhancer = combinEnhancer(Model, inst);
  return reducerEnhancer(combinReducer(model, reducers));
}
