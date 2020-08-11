/*
 * @Author: 欧阳鑫
 * @Date: 2020-08-10 11:35:26
 * @Last Modified by: 欧阳鑫
 * @Last Modified time: 2020-08-10 11:45:34
 *
 * after reducer 允许访问 state 以及 action
 */

import { store } from '../../../helper/store';
import { AnyAction } from 'redux';
import { DxModelInterface } from '@dxjs/shared/interfaces/dx-model.interface';

type afterReducerHookType = <T>(context: T) => T;

export function afterReducerHook<T>(state: T, action: AnyAction, model: DxModelInterface): void {
  const afterReducerHooks = store.plugins.get('afterReducer') as afterReducerHookType[];
  if (!afterReducerHooks || !afterReducerHooks.length) return;
  const context = { state, action, model };
  afterReducerHooks.forEach(hook => hook(context));
}
