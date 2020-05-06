/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type

import { SymbolType } from '@dxjs/shared/symbol';

export function mix(...mixins: any[]) {
  function copyProps(target: any, source: any): void {
    ([] as SymbolType[])
      .concat(Object.getOwnPropertyNames(source))
      .concat(Object.getOwnPropertySymbols(source))
      .forEach((prop: SymbolType) => {
        Reflect.set(target, prop, source[prop]);
      });
  }

  class Mix {
    constructor(...args: any[]) {
      mixins.forEach(Mixin => {
        copyProps(this, new Mixin(...args));
      });
    }
  }

  for (const Mixin of mixins) {
    copyProps(Mix, Mixin);
    copyProps(Mix.prototype, Mixin.prototype);
  }
  return Mix;
}
