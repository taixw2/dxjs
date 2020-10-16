import { AnyAction } from 'redux';
import { is } from '../../utils';
import { DxModel } from '../../dx-model/model';
import { EffectTypeInterface } from './index';

export function createEffectHandler(model: DxModel, meta: EffectTypeInterface) {
  return function*(action: AnyAction): Generator {
    try {
      const currentEffect = Reflect.get(model, meta.name);
      if (__DEV__) {
        require('invariant')(
          currentEffect && is.isGenerator(currentEffect),
          '副作用函数不是一个 generator 函数，函数名为: %s, 如果确定不是此原因，请提交 issus: %s',
          meta.name,
          '__ISSUE__',
        );
      }

      const resolve = yield currentEffect.call(model, action.payload, action);
      action.__dxjs_resolve?.(resolve);
      return resolve;
    } catch (error) {
      action.__dxjs_reject?.(error);
      throw error;
    }
  };
}
