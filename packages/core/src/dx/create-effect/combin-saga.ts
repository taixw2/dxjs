import { ForkEffect, call } from 'redux-saga/effects';
import { createEffectHandler } from './create-effect-handler';
import { createEffectFork } from './create-effect-fork';
import { AnyAction } from 'redux';
import beforeEffectHook from './hooks/beforeEffect';
import { createEffectContext } from './create-effect-context';
import effectHook from './hooks/effect';
import context from '../plugins/context';
import afterEffectHook from './hooks/afterEffect';
import { DxModel } from '../../dx-model/model';
import { EffectTypeInterface } from './index';

export function combinSaga(model: DxModel, meta: EffectTypeInterface): ForkEffect {
  function* effect(action: AnyAction): Generator {
    const baseContext = createEffectContext(model, meta, action);

    const beforeHookContext = {
      abort: false,
      ...baseContext,
    };

    // 判断 context 是否中断
    yield call(beforeEffectHook, beforeHookContext);
    if (beforeHookContext.abort) return;

    // 组合 promise
    const effect = createEffectHandler(model, meta);
    try {
      // 运行 effect
      const data = yield* effectHook(context, effect(action));
      //钩子
      afterEffectHook({ ...context, data, error: null });
    } catch (error) {
      afterEffectHook({ ...context, data: null, error: error });
      throw error;
    }
  }

  return createEffectFork(meta, effect);
}
