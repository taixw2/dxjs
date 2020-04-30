import { EffectTypeInterface } from '@dxjs/shared/interfaces/dx-effect-type.interface';
import { TAKE_LATEST, TAKE_EVERY, TAKE_LEADING, THROTTLE } from '@dxjs/shared/symbol';
import { spawn, takeLatest, takeEvery, takeLeading, throttle, ForkEffect } from 'redux-saga/effects';
import { AnyAction } from 'redux';

export function createEffectFork(meta: EffectTypeInterface, effectHandler: (action: AnyAction) => Generator): ForkEffect {
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
