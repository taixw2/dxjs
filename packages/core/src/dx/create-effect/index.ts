import { EFFECT_METHODS_META, SymbolType } from '@dxjs/shared/symbol';
import { DxModelInterface } from '@dxjs/shared/interfaces/dx-model.interface';
import { all, AllEffect, ForkEffect } from 'redux-saga/effects';
import { EffectTypeInterface } from '@dxjs/shared/interfaces/dx-effect-type.interface';
import { store } from '../../helper/store';
import { combinSaga } from './combin-saga';
import { hackTaro } from './hack-taro';
import { securityAccessMap } from '../../helper/sec-access-map';

export function createEffect(inst: symbol, model: DxModelInterface): void | (() => Generator<AllEffect<ForkEffect>>) {
  const Model = model.constructor;
  const effects: Set<EffectTypeInterface> = Reflect.getMetadata(EFFECT_METHODS_META, Model);
  if (!effects) return;

  hackTaro(model);

  // 收集 effect action
  const actionTypes = securityAccessMap(store.actionTypes, inst, {
    reducers: new Set<SymbolType>(),
    effects: new Set<SymbolType>(),
  });

  const currentSaga: ForkEffect[] = Array.from(effects).map(item => {
    actionTypes.effects.add(item.actionType);
    return combinSaga(model, item);
  });

  return function* saga(): Generator<AllEffect<ForkEffect>> {
    yield all(currentSaga);
  };
}
