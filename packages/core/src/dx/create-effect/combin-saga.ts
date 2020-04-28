import { EffectTypeInterface } from '@dxjs/shared/interfaces/dx-effect-type.interface';
import { DxModelInterface } from '@dxjs/shared/interfaces/dx-model.interface';
import { ForkEffect, call } from 'redux-saga/effects';
import { createEffectHandler } from './create-effect-handler';
import { createEffectFork } from './create-effect-fork';
import { AnyAction } from 'redux';
import { EffectContextInterface } from '@dxjs/shared/interfaces/dx-effect-context.interface';
import { combinSentinels } from './combin-sentinels';

export function combinSaga(
  model: DxModelInterface,
  meta: EffectTypeInterface,
  contextFactory: <T extends AnyAction>(action: T) => EffectContextInterface<T>,
): ForkEffect {
  function* effect(action: AnyAction): Generator {
    const context = contextFactory(action);
    const canNext = yield call(combinSentinels, context);
    if (canNext === false) return;

    createEffectHandler(model, meta);
  }

  return createEffectFork(meta, effect);
}
