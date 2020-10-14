import { createFactory } from './exports/create';
import { modelsFactory } from './exports/models';
import { collectFactory } from './exports/collect';
import { createStoreFactory } from './create-store';
import { changeDxInstance, store } from '../helper/store';

export function DxFactory() {
  const inst = Symbol('__dx');

  changeDxInstance(inst);

  // init
  if (store.plugins.size === 0) {
    store.plugins = new Map();
  }

  return {
    createStore: createStoreFactory(),
    create: createFactory(),
    getModels: modelsFactory(),
    collect: collectFactory(),
    inst: process.env.NODE_ENV === 'test' ? inst : undefined,
  };
}

export const Dx = DxFactory();
