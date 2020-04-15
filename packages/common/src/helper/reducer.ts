/* eslint-disable @typescript-eslint/no-explicit-any */
import { REDUCER_METHODS_KEY, SymbolType } from '@dxjs/shared/symbol';

export function Reducer(type?: string | symbol): MethodDecorator {
  return (
    target: any,
    key: string | symbol,
    descriptor: TypedPropertyDescriptor<any>,
  ): TypedPropertyDescriptor<any> => {
    // 通过 action type 获取对应的 target 方法，所以用 Map 结构
    const reducers: Map<SymbolType, SymbolType> =
      Reflect.getMetadata(REDUCER_METHODS_KEY, target.constructor) ?? new Map();

    reducers.set(type || Symbol('__action'), key);
    Reflect.defineMetadata(REDUCER_METHODS_KEY, reducers, target.constructor);
    return descriptor;
  };
}
