import { AnyAction } from 'redux';
import { isGenerator } from './is-generator';
import { EffectTypeInterface } from '@dxjs/shared/interfaces/dx-effect-type.interface';
import { DxModelInterface } from '@dxjs/shared/interfaces/dx-model.interface';
const invariant = require('invariant');

export function createEffectHandler(model: DxModelInterface, meta: EffectTypeInterface) {
  return function*(action: AnyAction): Generator {
    try {
      const currentEffect = Reflect.get(model, meta.name);
      if (__DEV__) {
        invariant(
          currentEffect && isGenerator(currentEffect),
          '副作用函数不是一个 generator 函数，函数名为: %s, 如果确定不是此原因，请提交 issus: %s',
          meta.name,
          '__ISSUE__',
        );
      }

      const resolve = yield currentEffect.call(model, action.payload);
      action.__dxjs_resolve?.(resolve);
      return resolve;
    } catch (error) {
      action.__dxjs_reject?.(error);
    }
  };
}
