/* eslint-disable @typescript-eslint/no-explicit-any */
import { SymbolType, DISGUISER_KEY } from '@dxjs/shared/symbol';
import { DisguiserStatic } from '@dxjs/shared/interfaces/dx-disguiser.interface';

export function UseDisguiser(disguiser: DisguiserStatic): MethodDecorator {
  return (target: any, key: SymbolType, descriptor: TypedPropertyDescriptor<any>): TypedPropertyDescriptor<any> => {
    const disguisers: DisguiserStatic[] = Reflect.getMetadata(DISGUISER_KEY, target.constructor) ?? [];
    disguisers.push(disguiser);
    Reflect.defineMetadata(DISGUISER_KEY, disguisers, target.constructor, key);
    return descriptor;
  };
}
