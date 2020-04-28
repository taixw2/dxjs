import { EffectTypeInterface } from '@dxjs/shared/interfaces/dx-effect-type.interface';
import { DxModelInterface } from '@dxjs/shared/interfaces/dx-model.interface';
import { ForkEffect } from 'redux-saga/effects';
import { createEffectHandler } from './create-effect-handler';
import { createEffectFork } from './create-effect-fork';

export function combinSaga(model: DxModelInterface, meta: EffectTypeInterface): ForkEffect {
  function* effect(): Generator {
    createEffectHandler(model, meta);
  }

  return createEffectFork(meta, effect);
}
