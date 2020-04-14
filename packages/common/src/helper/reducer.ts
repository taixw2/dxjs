/* eslint-disable @typescript-eslint/no-explicit-any */
import { REDUCER_METHODS_KEY } from '@dxjs/shared/symbol';

export function Reducer(type: string | symbol): MethodDecorator {
  return (
    target: any,
    key: string | symbol,
    descriptor: TypedPropertyDescriptor<any>,
  ): TypedPropertyDescriptor<any> => {
    const reducers: Map<symbol | string, symbol | string> =
      // 通过 action type 获取对应的 target 方法，所以用 Map 结构
      Reflect.getMetadata(target, REDUCER_METHODS_KEY) ?? new Map<symbol | string, symbol>();

    reducers.set(type || Symbol('__action'), key);
    Reflect.defineMetadata(REDUCER_METHODS_KEY, [], target);
    return descriptor;
  };
}
