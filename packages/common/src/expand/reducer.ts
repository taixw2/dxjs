/*
 * @Author: 欧阳鑫
 * @Date: 2020-08-10 19:27:00
 * @Last Modified by: 欧阳鑫
 * @Last Modified time: 2020-08-11 16:21:32
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { REDUCER_METHODS_KEY } from '@dxjs/shared/symbol';
import { mark } from '../mark';

export function Reducer(type?: string | symbol): MethodDecorator {
  return (target: any, key: string | symbol, descriptor: TypedPropertyDescriptor<any>): TypedPropertyDescriptor<any> => {
    // 通过 action type 获取对应的 target 方法，所以用 Map 结构

    mark(REDUCER_METHODS_KEY, [type || Symbol((key as string) ?? '__action'), key])(target.constructor);
    return descriptor ?? target;
  };
}
