/*
 * @Author: 欧阳鑫
 * @Date: 2020-08-10 08:52:15
 * @Last Modified by: 欧阳鑫
 * @Last Modified time: 2020-10-14 16:59:38
 */

import { store } from '../helper/store';
import { is } from '../utils';

export type Hook =
  | 'beforeDispatch'
  | 'afterDispatch'
  | 'beforeEffect'
  | 'effect'
  | 'afterEffect'
  | 'beforeReducer'
  | 'reducer'
  | 'afterReducer';

export const PluginContext = {
  hooks(hook: Hook, handler: unknown) {
    const hooks = store.plugins.get(hook) ?? [];
    hooks.push(handler);
    store.plugins.set(hook, hooks);
  },
};

export type ClassPlugin = {
  apply(ctx: typeof PluginContext): void;
};

export type DxPlugin = { new (): ClassPlugin } | ((ctx: typeof PluginContext) => void);

// store plugin
export default function createPlugin(plugins?: DxPlugin[]) {
  if (!Array.isArray(plugins)) return;
  plugins.forEach(plugin => {
    if (is.isClass<{ new (): ClassPlugin }>(plugin)) {
      new plugin().apply(PluginContext);
      return;
    }
    plugin(PluginContext);
  });
}
