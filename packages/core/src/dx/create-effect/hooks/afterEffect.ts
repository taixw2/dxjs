/*
 * @Author: 欧阳鑫
 * @Date: 2020-08-10 17:02:11
 * @Last Modified by: 欧阳鑫
 * @Last Modified time: 2020-10-14 14:35:03
 */

import { store } from '../../../helper/store';

function afterEffectHook<T>(context: T): void {
  const afterEffects = (store.plugins.get('afterEffect') as (<T>(context: T) => void)[]) ?? [];

  afterEffects.forEach(hook => {
    hook(context);
  });
}

export default afterEffectHook;
