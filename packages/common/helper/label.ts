/* eslint-disable @typescript-eslint/no-explicit-any */
import { LABEL } from '../shared';

export function Label(...labels: string[]): MethodDecorator & ClassDecorator {
  return (
    target: any,
    key?: string | symbol,
    descriptor?: TypedPropertyDescriptor<any>,
  ): TypedPropertyDescriptor<any> | any => {
    if (descriptor) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const pLabels = Reflect.getMetadata(LABEL, target.constructor, key!) || [];
      Reflect.defineMetadata(
        LABEL,
        [...new Set([...pLabels, ...labels])],
        target.constructor,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        key!,
      );
      return descriptor;
    }

    const pLabels = Reflect.getMetadata(LABEL, target) || [];
    Reflect.defineMetadata(LABEL, [...new Set([...pLabels, ...labels])], target);
    return target;
  };
}
