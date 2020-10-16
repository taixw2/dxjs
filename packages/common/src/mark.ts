/* eslint-disable @typescript-eslint/no-explicit-any */
import { SymbolType } from '@dxjs/shared/symbol';

export function mark<T>(labelKey: SymbolType, labelValue: T): MethodDecorator & ClassDecorator {
  return (
    target: any,
    key?: string | symbol,
    descriptor?: TypedPropertyDescriptor<any>,
  ): TypedPropertyDescriptor<any> | any => {
    if (descriptor && key) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const previousLabels = Reflect.getMetadata(labelKey, target.constructor, key) || [];
      Reflect.defineMetadata(labelKey, [...new Set([...previousLabels, labelValue])], target.constructor, key);
      return descriptor;
    }

    const previousLabels = Reflect.getMetadata(labelKey, target) || [];
    Reflect.defineMetadata(labelKey, [...new Set([...previousLabels, labelValue])], target);
    return target;
  };
}

// 标记
