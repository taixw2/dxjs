/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseEffectContextInterface } from '@dxjs/shared/interfaces/dx-effect-context.interface';
import { store } from '../../helper/store';
import { EffectTypeInterface } from '@dxjs/shared/interfaces/dx-effect-type.interface';
import { DxModelInterface } from '@dxjs/shared/interfaces/dx-model.interface';
import { AnyAction } from 'redux';

export function createEffectContext<T>(
  model: DxModelInterface,
  meta: EffectTypeInterface,
  action: T,
): BaseEffectContextInterface<T> {
  return {
    meta,
    action,
    model,
    getState: (): unknown => store.reduxStore.getState(),
    dispatch: (action: AnyAction): AnyAction => store.reduxStore.dispatch(action),
  };
}
