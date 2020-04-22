import { EffectTypeInterface } from '@dxjs/shared/interfaces/dx-effect-type.interface';
import { DxModelInterface } from '@dxjs/shared/interfaces/dx-model.interface';
import { AnyAction } from 'redux';
import { isGenerator } from './is-generator';
import { TAKE_LATEST, TAKE_EVERY, TAKE_LEADING, THROTTLE } from '@dxjs/shared/symbol';
import { spawn, takeLatest, takeEvery, takeLeading, throttle, ForkEffect } from 'redux-saga/effects';
const invariant = require('invariant');

export function combinSaga(model: DxModelInterface, meta: EffectTypeInterface): ForkEffect {
  function* effectHandler(action: AnyAction): Generator {
    try {
      const currentEffect = Reflect.get(model, meta.name);
      if (__DEV__) {
        invariant(
          currentEffect && isGenerator(currentEffect),
          '副作用函数不是一个 generator 函数，函数名为: %s, 如果确定不是此原因，请提交 issus: %s',
          meta.name,
          __ISSUE__,
        );
      }

      const resolve = yield currentEffect.call(model, action.payload);
      action.__dxjs_resolve?.(resolve);
      return resolve;
    } catch (error) {
      action.__dxjs_reject?.(error);
    }
  }

  return spawn(function*() {
    switch (meta.helperType) {
      case TAKE_EVERY:
        yield takeEvery(meta.actionType, effectHandler);
        break;
      case TAKE_LATEST:
        yield takeLatest(meta.actionType, effectHandler);
        break;
      case TAKE_LEADING:
        yield takeLeading(meta.actionType, effectHandler);
        break;
      case THROTTLE:
        yield throttle(meta.value[0] ?? 350, meta.actionType, effectHandler);
        break;
      default:
        yield takeEvery(meta.actionType, effectHandler);
        break;
    }
  });
}
