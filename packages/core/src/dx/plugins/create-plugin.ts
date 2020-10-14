/*
 * @Author: 欧阳鑫
 * @Date: 2020-08-10 08:52:15
 * @Last Modified by: 欧阳鑫
 * @Last Modified time: 2020-08-10 11:56:00
 */

import { is } from '../../utils';
import context, { Hook } from './context';

interface Context {
  hooks(hook: Hook, callback: unknown): void;
}

interface ClassPlugin {
  apply(ctx: Context): void;
}

export type DxPlugin = { new (): ClassPlugin } | ((ctx: Context) => void);

export default function storePlugins(plugins?: DxPlugin[]): void {
  if (!plugins || !plugins.length) return;

  plugins.forEach(Plugin => {
    if (is.isClassPlugin(Plugin)) {
      return new Plugin().apply(context);
    }

    Plugin(context);
  });
}
