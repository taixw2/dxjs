import { createFactory } from './exports/create';
import { modelsFactory } from './exports/models';
import { collectFactory } from './exports/collect';
import { createStoreFactory } from './create-store';

export function DxFactory() {
  return {
    createStore: createStoreFactory(),
    create: createFactory(),
    // 后面可能会有所改动
    UNSAFE_getModels: modelsFactory(),
    UNSAFE_collect: collectFactory(),
  };
}

export const Dx = DxFactory();
