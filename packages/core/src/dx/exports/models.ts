/* eslint-disable @typescript-eslint/no-explicit-any */
import { DxModelInterface } from '@dxjs/shared/interfaces/dx-model.interface';
import { store } from '../../helper/store';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const invariant = require('invariant');

export type GetModels =
  | { new (): DxModelInterface<any> }
  | { [key: string]: new () => DxModelInterface<any> }
  | undefined;

export function modelsFactory(inst: symbol) {
  return (match?: string | RegExp): GetModels => {
    const map = store.models.get(inst)?.map || {};
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const set = store.models.get(inst)!.set;
    if (!match) return map;
    if (process.env.NODE_ENV === 'development') {
      invariant(
        ['string', 'undefined'].some(type => typeof match === type) || match instanceof RegExp,
        '请传入有效的参数，当前参数类型为 %s, 但只接受 string、undefined、regexp 的类型',
        typeof match,
      );
    }

    if (typeof match === 'string') {
      if (Reflect.has(map, match)) {
        return Reflect.get(map, match);
      }
      return [...set].find(model => model.name.startsWith(match));
    }
    return [...set].find(model => match.test(model.name));
  };
}
