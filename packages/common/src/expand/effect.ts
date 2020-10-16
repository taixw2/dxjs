/* eslint-disable @typescript-eslint/no-explicit-any */
/*
 * @Author: 欧阳鑫
 * @Date: 2020-08-10 19:21:08
 * @Last Modified by: 欧阳鑫
 * @Last Modified time: 2020-08-11 16:21:28
 */

import { mark } from '../mark';
import { EFFECT_METHODS_KEY, EFFECT_METHODS_META, EFFECT_HELPERS, TAKE_EVERY, SymbolType } from '@dxjs/shared/symbol';

export function Effect(actionTypeArg?: SymbolType, helperTypeArg?: any, ...args: any[]): MethodDecorator {
  return (target: any, key: SymbolType, descriptor: TypedPropertyDescriptor<any>): TypedPropertyDescriptor<any> => {
    /**
     * 参数替换：
     * @Effect()
     * @Effect(TakeEvery)
     * @Effect("actionType", TakeEvery)
     * @Effect(Throttle, 350)
     * @Effect("actionType", Throttle, 350)
     */
    const _defaultActionType = Symbol(String(key));
    let _actionType = actionTypeArg ?? _defaultActionType;
    let _helperType = helperTypeArg ?? TAKE_EVERY;

    if (EFFECT_HELPERS.includes(actionTypeArg!)) {
      if (helperTypeArg) args.unshift(helperTypeArg);
      [_actionType, _helperType] = [_defaultActionType, actionTypeArg!];
    }

    mark(EFFECT_METHODS_KEY, key)(target.constructor);
    mark(EFFECT_METHODS_META, { name: key, value: args, helperType: _helperType, actionType: _actionType })(
      target.constructor,
    );

    return descriptor ?? target;
  };
}
