/* eslint-disable @typescript-eslint/no-explicit-any */
import { SymbolType, SENTINEL_KEY } from '@dxjs/shared/symbol';
import { DisguiserStatic } from '@dxjs/shared/interfaces/dx-disguiser.interface';

export function UseSentinel(sentinel: DisguiserStatic): MethodDecorator {
  return (target: any, key: SymbolType, descriptor: TypedPropertyDescriptor<any>): TypedPropertyDescriptor<any> => {
    const sentinels: DisguiserStatic[] = Reflect.getMetadata(SENTINEL_KEY, target.constructor) ?? [];
    sentinels.push(sentinel);
    Reflect.defineMetadata(SENTINEL_KEY, sentinels, target.constructor, key);
    return descriptor;
  };
}
