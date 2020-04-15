import { createFactory } from './exports/create';
import { modelsFactory } from './exports/models';
import { collectFactory } from './exports/collect';
import { createStoreFactory } from './exports/create-store';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function DxFactory() {
  const inst = Symbol('__dx');
  return {
    createStore: createStoreFactory(inst),
    create: createFactory(inst),
    models: modelsFactory(inst),
    collect: collectFactory(inst),
  };
}

export const Dx = DxFactory();
