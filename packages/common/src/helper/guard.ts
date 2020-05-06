/* eslint-disable @typescript-eslint/no-explicit-any */
import { SymbolType, GUARD_KEY } from '@dxjs/shared/symbol';
import { EnhancerSupportInterface } from '@dxjs/shared/interfaces/dx-effect-support.interface';
import { GuardInterface } from '@dxjs/shared/interfaces/dx-guard.interface';

export function UseGuard(guard: EnhancerSupportInterface<GuardInterface>): MethodDecorator {
  return (target: any, key: SymbolType, descriptor: TypedPropertyDescriptor<any>): TypedPropertyDescriptor<any> => {
    const guards: EnhancerSupportInterface<GuardInterface>[] = Reflect.getMetadata(GUARD_KEY, target.constructor) ?? [];
    guards.push(guard);
    Reflect.defineMetadata(GUARD_KEY, guards, target.constructor, key);
    return descriptor;
  };
}
