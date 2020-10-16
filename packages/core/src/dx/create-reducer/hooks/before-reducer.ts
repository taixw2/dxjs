/*
 * @Author: 欧阳鑫
 * @Date: 2020-08-10 11:40:55
 * @Last Modified by: 欧阳鑫
 * @Last Modified time: 2020-08-10 11:45:08
 *
 * before hooks 能够修改 action，以及获取 state
 */

import { store } from '../../../helper/store';
import { AnyAction } from 'redux';
import { DxModel } from '../../../dx-model/model';

type beforeReducerHookType = <T>(context: T) => T;

export function beforeReducerHook<T>(state: T, action: AnyAction, model: DxModel): void {
  const beforeReducerHooks = store.plugins.get('beforeReducer') as beforeReducerHookType[];
  if (!beforeReducerHooks || !beforeReducerHooks.length) return;
  const context = { state, action, model };
  beforeReducerHooks.forEach(hook => hook(context));
}
