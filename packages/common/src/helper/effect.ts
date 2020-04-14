/* eslint-disable @typescript-eslint/no-explicit-any */
import { TAKE_EVERY, EFFECT_METHODS_KEY, SymbolType } from '@dxjs/shared/symbol';
import { EffectTypeInterface } from '@dxjs/shared/interfaces/dx-effect-type.interface';

export function Effect(
  actionType: string | symbol,
  helperType: SymbolType = TAKE_EVERY,
  ...args: any[]
): MethodDecorator {
  return (
    target: any,
    key: string | symbol,
    descriptor: TypedPropertyDescriptor<any>,
  ): TypedPropertyDescriptor<any> => {
    // eslint-disable-next-line prettier/prettier
    const effectMates = Reflect.getMetadata(EFFECT_METHODS_KEY, target.constructor) as Set<EffectTypeInterface>;
    effectMates.add({
      name: key,
      value: args,
      helperType: helperType,
      actionType: actionType,
    });
    return descriptor;
  };
}
