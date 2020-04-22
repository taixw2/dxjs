import * as DxCommon from '@dxjs/common';
import { DxModelInterface } from '@dxjs/shared/interfaces/dx-model.interface';
import { isGenerator } from './is-generator';

/**
 * taro 中对装饰器支持不好
 * 默认则认为所有的 generator 函数都是 effect 函数
 */
export function hackTaro(model: DxModelInterface) {
  if (typeof process === 'undefined' || typeof process.env !== 'object' || typeof process.env.TARO_ENV === 'undefined') {
    return;
  }

  Object.getOwnPropertyNames(Object.getPrototypeOf(model)).forEach(key => {
    if (!isGenerator(model[key])) return;
    DxCommon.Effect()(model, key, {});
  });
}
