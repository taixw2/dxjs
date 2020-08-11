import { DxModelContstructor } from '@dxjs/shared/interfaces/dx-model.interface';
import { Hook } from '@dxjs/shared/interfaces/dx-plugin.interface';
import { Store } from 'redux';
import { SymbolType } from '@dxjs/shared/symbol';

interface ModelRefs {
  set: Set<DxModelContstructor>;
  map: { [key: string]: DxModelContstructor };
}

// TODO: 多实例待测试
let dxInstance: SymbolType = '';

export function changeDxInstance(instance: SymbolType): void {
  dxInstance = instance;
}

const plugins = new Map<SymbolType, Map<Hook, unknown[]>>();
const models = new Map<SymbolType, ModelRefs>();
const reduxStore = new Map<SymbolType, Store>();
const effectTypes = new Map<SymbolType, Set<SymbolType>>();

export const store = {
  set plugins(value: Map<Hook, unknown[]>) {
    plugins.set(dxInstance, value);
  },

  get plugins(): Map<Hook, unknown[]> {
    return plugins.get(dxInstance) ?? new Map();
  },

  set models(value: ModelRefs) {
    models.set(dxInstance, value);
  },

  get models(): ModelRefs {
    return models.get(dxInstance)!;
  },

  set reduxStore(value: Store) {
    reduxStore.set(dxInstance, value);
  },

  get reduxStore(): Store {
    return reduxStore.get(dxInstance)!;
  },

  set effectTypes(value: Set<SymbolType>) {
    effectTypes.set(dxInstance, value);
  },

  get effectTypes(): Set<SymbolType> {
    return effectTypes.get(dxInstance)!;
  },

  getModels(): ModelRefs {
    if (!store.models) {
      store.models = { set: new Set(), map: {} };
    }
    return store.models;
  },
};

// 流程演示
// 1. 实例化 store, 所有的都被保存在对应的 instance 中
// 2. dispatch 找到对应的 plugins
