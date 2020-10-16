/*
 * @Author: 欧阳鑫
 * @Date: 2020-08-10 19:20:35
 * @Last Modified by: 欧阳鑫
 * @Last Modified time: 2020-08-10 19:30:45
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
import { LABEL } from '@dxjs/shared/symbol';
import { mark } from '../mark';

export function Label(...labels: string[]): MethodDecorator & ClassDecorator {
  return (
    target: any,
    key?: string | symbol,
    descriptor?: TypedPropertyDescriptor<any>,
  ): TypedPropertyDescriptor<any> | any => {
    labels.forEach(label => mark(LABEL, label)(target, key!, descriptor!));
    return descriptor || target;
  };
}
