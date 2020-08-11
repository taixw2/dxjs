import { EFFECT_METHODS_META } from '@dxjs/shared/symbol';
import { DxModelInterface } from '@dxjs/shared/interfaces/dx-model.interface';
import { all, AllEffect, ForkEffect } from 'redux-saga/effects';
import { EffectTypeInterface } from '@dxjs/shared/interfaces/dx-effect-type.interface';
import { store } from '../../helper/store';
import { combinSaga } from './combin-saga';
// import { hackTaro } from './hack-taro';
// import { createEffectContext } from './create-effect-context';

export function createEffect(model: DxModelInterface): void | (() => Generator<AllEffect<ForkEffect>>) {
  const Model = model.constructor;
  const effects: Set<EffectTypeInterface> = Reflect.getMetadata(EFFECT_METHODS_META, Model);
  if (!effects) return;

  // hackTaro(model);

  const actionTypes = store.effectTypes ?? (store.effectTypes = new Set());
  const currentSaga: ForkEffect[] = Array.from(effects).map(item => {
    actionTypes.add(item.actionType);
    return combinSaga(model, item);
  });

  return function* saga(): Generator<AllEffect<ForkEffect>> {
    yield all(currentSaga);
  };
}
