import { EffectContextInterface, BaseEffectContextInterface } from '@dxjs/shared/interfaces/dx-effect-context.interface';
import { store } from '../../helper/store';
import { EffectTypeInterface } from '@dxjs/shared/interfaces/dx-effect-type.interface';
import { enhancerFilterWithMethod } from '../../helper/enhancer-filter';
import { DxModelInterface, DxModelContstructor } from '@dxjs/shared/interfaces/dx-model.interface';
import { EnhancerFilter } from '@dxjs/shared/interfaces/dx-enhancer.interface';
import {
  EnhancerSupportStatic,
  EnhancerFunctionSupportInterface,
} from '@dxjs/shared/interfaces/dx-effect-support.interface';
import { AnyAction } from 'redux';
import { SentinelInterface } from '@dxjs/shared/interfaces/dx-sentinel.interface';

function isEnhancerSupportStatic(func: unknown): func is EnhancerSupportStatic {
  return typeof func === 'function' && /^class/.test(func.toString());
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isSentinelInterface<T extends AnyAction>(instance: any): instance is SentinelInterface<T> {
  return Reflect.has(instance, 'sentinel');
}

function enhancerFactory<T extends AnyAction>(
  enhancers: EnhancerFilter<EnhancerSupportStatic | EnhancerFunctionSupportInterface>[],
): EnhancerFunctionSupportInterface[] {
  return enhancers.map(item => {
    const { enhancer: Enhancer } = item;
    if (isEnhancerSupportStatic(Enhancer)) {
      return async (context: BaseEffectContextInterface<T>, error?: Error, data?: unknown): Promise<boolean | void> => {
        const instance = new Enhancer(context, error, data);
        if (isSentinelInterface(instance)) {
          return instance.sentinel();
        }
        return instance.guard(error, data);
      };
    }
    return Enhancer;
  });
}

export function createEffectContext(
  inst: symbol,
  model: DxModelInterface,
  meta: EffectTypeInterface,
): <T extends AnyAction>(action: T) => EffectContextInterface<T> {
  const istore = store.reduxStore.get(inst)!;
  const enhancers = store.enhancer.get(inst)!;
  const modelConstructor = model.constructor as DxModelContstructor;

  const guards = enhancerFactory(enhancerFilterWithMethod(modelConstructor, meta.name, enhancers.guards));
  const sentinels = enhancerFactory(enhancerFilterWithMethod(modelConstructor, meta.name, enhancers.sentinels));
  const spies = enhancerFilterWithMethod(modelConstructor, meta.name, enhancers.spies).map(item => item.enhancer);

  return <T>(action: T): EffectContextInterface<T> => {
    return {
      inst,
      meta,
      action,
      getState: istore.getState(),
      dispatch: istore.dispatch,
      guards,
      sentinels,
      spies,
    };
  };
}
