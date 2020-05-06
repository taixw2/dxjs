/* eslint-disable @typescript-eslint/no-explicit-any */
import { EffectContextInterface, BaseEffectContextInterface } from '@dxjs/shared/interfaces/dx-effect-context.interface';
import { store } from '../../helper/store';
import { EffectTypeInterface } from '@dxjs/shared/interfaces/dx-effect-type.interface';
import { enhancerFilterWithMethod, enhancerFilter } from '../../helper/enhancer-filter';
import { DxModelInterface, DxModelContstructor } from '@dxjs/shared/interfaces/dx-model.interface';
import {
  EnhancerSupportStatic,
  EnhancerFunctionSupportInterface,
  EnhancerSupportInterface,
} from '@dxjs/shared/interfaces/dx-effect-support.interface';
import { AnyAction } from 'redux';
import { SentinelInterface } from '@dxjs/shared/interfaces/dx-sentinel.interface';
import { DISGUISER_KEY, SENTINEL_KEY, GUARD_KEY } from '@dxjs/shared/symbol';
import { EnhancerFilter } from '@dxjs/shared/interfaces/dx-enhancer.interface';
import { DisguiserStatic } from '@dxjs/shared/interfaces/dx-disguiser.interface';
import { GuardInterface } from '@dxjs/shared/interfaces/dx-guard.interface';

function isEnhancerSupportStatic(func: unknown): func is EnhancerSupportStatic<any> {
  return typeof func === 'function' && /^class/.test(func.toString());
}

function isSentinelInterface<T extends AnyAction>(instance: any): instance is SentinelInterface<T> {
  return Reflect.has(instance, 'sentinel');
}

function enhancerFactory<T extends AnyAction>(
  enhancers: EnhancerSupportInterface<any>[],
): EnhancerFunctionSupportInterface[] {
  return enhancers.map(Enhancer => {
    if (isEnhancerSupportStatic(Enhancer)) {
      return async ({ error, data, ...context }: BaseEffectContextInterface<T>): Promise<boolean | void> => {
        const instance = new Enhancer(context, error, data);
        if (isSentinelInterface(instance)) {
          return instance.sentinel();
        }
        return instance.guard(error, data);
      };
    }
    return ({ error, data, ...context }: BaseEffectContextInterface<T>): Promise<boolean | void> =>
      Enhancer(context, error, data);
  });
}

export function createEffectContext(
  inst: symbol,
  model: DxModelInterface,
  meta: EffectTypeInterface,
): <T extends AnyAction>(action: T) => EffectContextInterface<T> {
  const enhancers = store.enhancer.get(inst);
  const ModelConstructor = model.constructor as DxModelContstructor;

  const guards = enhancerFactory([
    ...enhancerFilter(ModelConstructor, enhancers?.guards as EnhancerFilter<EnhancerSupportInterface<GuardInterface>>[]).map(
      item => item.enhancer,
    ),
    ...enhancerFilterWithMethod<EnhancerSupportInterface<GuardInterface>>(ModelConstructor, meta.name, GUARD_KEY),
  ]);

  const sentinels = enhancerFactory([
    ...enhancerFilter(
      ModelConstructor,
      enhancers?.sentinels as EnhancerFilter<EnhancerSupportInterface<SentinelInterface>>[],
    ).map(item => item.enhancer),
    ...enhancerFilterWithMethod<EnhancerSupportInterface<SentinelInterface>>(ModelConstructor, meta.name, SENTINEL_KEY),
  ]);

  const disguisers = [
    ...enhancerFilter(ModelConstructor, enhancers?.disguisers as EnhancerFilter<DisguiserStatic>[]).map(
      item => item.enhancer,
    ),
    ...enhancerFilterWithMethod<DisguiserStatic>(ModelConstructor, meta.name, DISGUISER_KEY),
  ];

  return <T>(action: T): EffectContextInterface<T> => {
    const istore = store.reduxStore.get(inst)!;
    return {
      inst,
      meta,
      action,
      getState: (): unknown => istore.getState(),
      dispatch: (action: AnyAction): AnyAction => istore.dispatch(action),
      guards,
      sentinels,
      disguisers,
    };
  };
}
