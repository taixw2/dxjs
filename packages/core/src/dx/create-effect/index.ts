import { EFFECT_METHODS_META, SymbolType } from '@dxjs/shared/symbol';
import { all, AllEffect, ForkEffect } from 'redux-saga/effects';
import { store } from '../../helper/store';
import { combinSaga } from './combin-saga';
import { DxModel } from '../../dx-model/model';

export interface EffectTypeInterface {
  name: SymbolType;
  // action type
  actionType: SymbolType;
  /**
   * saga helper
   * TAKE_EVERY,TAKE_LATEST,TAKE_LEADING,THROTTLE
   */
  helperType: SymbolType;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value?: any;
}

export function createEffect(model: DxModel): void | (() => Generator<AllEffect<ForkEffect>>) {
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
