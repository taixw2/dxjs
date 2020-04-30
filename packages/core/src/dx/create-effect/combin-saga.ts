import { EffectTypeInterface } from '@dxjs/shared/interfaces/dx-effect-type.interface';
import { DxModelInterface } from '@dxjs/shared/interfaces/dx-model.interface';
import { ForkEffect, call } from 'redux-saga/effects';
import { createEffectHandler } from './create-effect-handler';
import { createEffectFork } from './create-effect-fork';
import { AnyAction } from 'redux';
import { EffectContextInterface } from '@dxjs/shared/interfaces/dx-effect-context.interface';
import compose from 'koa-compose';
import { composeDisguiser } from './compose-disguisers';

export function combinSaga(
  model: DxModelInterface,
  meta: EffectTypeInterface,
  contextFactory: <T extends AnyAction>(action: T) => EffectContextInterface<T>,
): ForkEffect {
  function* effect(action: AnyAction): Generator {
    const context = contextFactory(action);

    // 哨兵在执行真实的 effect 之前执行
    // 当其中一个返回 false 之后，则会中断整个 effect
    for (let index = 0; index < context.sentinels.length; index++) {
      const canNext = yield call(context.sentinels[index], context);
      if (canNext === false) return;
    }
    const effect = createEffectHandler(model, meta);

    try {
      // 伪装者会被植入到 effect 中
      const data = yield* composeDisguiser(context)(effect(action));

      // 守卫在最后执行，能过做一些收集、重试等工作
      yield call(compose(context.guards), { ...context, data, error: null });
    } catch (error) {
      yield call(compose(context.guards), { ...context, data: null, error });
      throw error;
    }
  }

  return createEffectFork(meta, effect);
}
