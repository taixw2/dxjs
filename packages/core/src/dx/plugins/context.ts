/*
 * @Author: 欧阳鑫
 * @Date: 2020-08-10 08:52:56
 * @Last Modified by: 欧阳鑫
 * @Last Modified time: 2020-08-10 16:17:10
 */

import { store } from '../../helper/store';

export type Hook =
  | 'beforeDispatch'
  | 'afterDispatch'
  | 'beforeEffect'
  | 'effect'
  | 'afterEffect'
  | 'beforeReducer'
  | 'reducer'
  | 'afterReducer';

export default {
  hooks(hook: Hook, callback: unknown): void {
    const hooks = store.plugins.get(hook) || store.plugins.set(hook, []).get(hook);
    hooks?.push(callback);
  },
};
