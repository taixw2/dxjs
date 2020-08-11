/*
 * @Author: 欧阳鑫
 * @Date: 2020-08-10 15:20:45
 * @Last Modified by: 欧阳鑫
 * @Last Modified time: 2020-08-10 15:49:23
 */

import { store } from '../../../helper/store';

const beforeEffectHook = <T>(context: T): Promise<unknown> => {
  const beforeEffects = store.plugins.get('beforeEffect') as (<T>(ctx: T, next: () => void) => unknown)[];
  if (!beforeEffects?.length) {
    return Promise.resolve();
  }

  function dispatch(i: number): Promise<unknown> {
    const fn = beforeEffects?.[i];
    if (!fn) return Promise.resolve();

    try {
      return Promise.resolve(fn(context, () => dispatch(i + 1)));
    } catch (error) {
      return Promise.reject(error);
    }
  }

  return dispatch(0);
};

export default beforeEffectHook;
