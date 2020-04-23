import { AnyAction } from 'redux';
import { DxModelInterface } from '@dxjs/shared/interfaces/dx-model.interface';
import { SymbolType, REDUCER_ENHANCER_KEY } from '@dxjs/shared/symbol';
import { ReducerEnhancer } from '@dxjs/shared/interfaces/dx-reducer-enhancer.interface';
import { Reducer } from 'redux';

export function combinReducer<T>(model: DxModelInterface, reducers: Map<SymbolType, SymbolType>) {
  return (state: T, action: AnyAction): T => {
    model.state = state || model.state;
    const methodName = reducers.get(action.type);
    if (!methodName) return model.state;

    const enhances: ReducerEnhancer[] = Reflect.getMetadata(REDUCER_ENHANCER_KEY, model.constructor, methodName) ?? [];
    let reducer: Reducer = Reflect.get(model, methodName);
    if (enhances.length) {
      reducer = enhances.reduce((a, b) => a(b))(reducer);
    }
    return reducer.call(model, action.payload, model.state) ?? model.state;
  };
}
