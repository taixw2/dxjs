/* eslint-disable @typescript-eslint/no-explicit-any */
import { TAKE_EVERY, EFFECT_METHODS_KEY, SymbolType, EFFECT_HELPERS } from '@dxjs/shared/symbol';
import { EffectTypeInterface } from '@dxjs/shared/interfaces/dx-effect-type.interface';

export function Effect(
  actionType?: SymbolType,
  helperType?: SymbolType,
  ...args: any[]
): MethodDecorator {
  /**
   * 参数替换：
   * @Effect()
   * @Effect(TakeEvery)
   * @Effect("actionType", TakeEvery)
   * @Effect(Throttle, 350)
   * @Effect("actionType", Throttle, 350)
   */
  const _defaultActionType = Symbol('__action_type');
  let _actionType = actionType ?? _defaultActionType;
  let _helperType = helperType ?? TAKE_EVERY;
  if (EFFECT_HELPERS.includes(_actionType)) {
    if (helperType) args.unshift(helperType);
    [_actionType, _helperType] = [_defaultActionType, _actionType];
  }

  return (
    target: any,
    key: string | symbol,
    descriptor: TypedPropertyDescriptor<any>,
  ): TypedPropertyDescriptor<any> => {
    // eslint-disable-next-line prettier/prettier
    const effectMates: Set<EffectTypeInterface> =
      Reflect.getMetadata(EFFECT_METHODS_KEY, target.constructor) ?? new Set();
    effectMates.add({
      name: key,
      value: args,
      helperType: _helperType,
      actionType: _actionType,
    });
    Reflect.defineMetadata(EFFECT_METHODS_KEY, effectMates, target.constructor);
    return descriptor;
  };
}
