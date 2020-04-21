import {
  TAKE_LATEST,
  TAKE_EVERY,
  TAKE_LEADING,
  THROTTLE,
  EFFECT_METHODS_KEY,
} from '@dxjs/shared/symbol';
import { DxModelInterface } from '@dxjs/shared/interfaces/dx-model.interface';
import {
  all,
  AllEffect,
  spawn,
  ForkEffect,
  takeLatest,
  takeEvery,
  takeLeading,
  throttle,
} from 'redux-saga/effects';
import { EffectTypeInterface } from '@dxjs/shared/interfaces/dx-effect-type.interface';
import { AnyAction } from 'redux';
import * as DxCommon from '@dxjs/common';

interface IsGeneratorExtend extends Function {
  isGenerator?(): boolean;
}

function isGenerator(fn?: IsGeneratorExtend) {
  if (!fn) return false;
  if ('isGenerator' in Function.prototype) return fn.isGenerator?.();
  return fn.constructor && 'GeneratorFunction' == fn.constructor.name;
}

/**
 * taro 中对装饰器支持不好
 * 默认则认为所有的 generator 函数都是 effect 函数
 */
function hackTaro(model: DxModelInterface) {
  if (
    typeof process === 'undefined' ||
    typeof process.env !== 'object' ||
    typeof process.env.TARO_ENV === 'undefined'
  ) {
    return;
  }

  Object.getOwnPropertyNames(Object.getPrototypeOf(model)).forEach(key => {
    if (!isGenerator(model[key])) return;
    DxCommon.Effect()(model, key, {});
  });
}

export function createSaga(model: DxModelInterface): () => Generator<AllEffect<ForkEffect>> {
  const Model = model.constructor;
  hackTaro(model);

  const effectMates =
    (Reflect.getMetadata(EFFECT_METHODS_KEY, Model) as Set<EffectTypeInterface>) ?? new Set();

  const effects = [...effectMates].map(effectItem => {
    function* effect(action: AnyAction): Generator {
      return yield model[effectItem.name as string](action.payload);
    }
    return spawn(function*() {
      switch (effectItem.helperType) {
        case TAKE_EVERY:
          yield takeEvery(effectItem.actionType, effect.bind(model));
          break;
        case TAKE_LATEST:
          yield takeLatest(effectItem.actionType, effect.bind(model));
          break;
        case TAKE_LEADING:
          yield takeLeading(effectItem.actionType, effect.bind(model));
          break;
        case THROTTLE:
          yield throttle(effectItem.value[0] ?? 350, effectItem.actionType, effect.bind(model));
          break;
        default:
          yield takeEvery(effectItem.actionType, effect.bind(model));
          break;
      }
    });
  });

  return function* saga(): Generator<AllEffect<ForkEffect>> {
    yield all(effects);
  };
}
