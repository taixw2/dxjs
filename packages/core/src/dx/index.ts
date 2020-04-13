import { createFactory } from './exports/create';
import { modelsFactory } from './exports/models';
import { collectFactory } from './exports/collect';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function DxFactory() {
  const inst = Symbol('__dx');
  return {
    create: createFactory(inst),
    models: modelsFactory(inst),
    collect: collectFactory(inst),
  };
}

export const Dx = DxFactory();
