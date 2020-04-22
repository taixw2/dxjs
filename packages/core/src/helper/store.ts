import { DxEnhancer } from '@dxjs/shared/interfaces/dx-enhancer.interface';
import { DxModelContstructor } from '@dxjs/shared/interfaces/dx-model.interface';
import { Store } from 'redux';
import { SymbolType } from '@dxjs/shared/symbol';

interface ModelRefs {
  set: Set<DxModelContstructor>;
  map: { [key: string]: DxModelContstructor };
}

interface StoreActionType {
  // 用于记录生成的 action type
  reducers: Set<SymbolType>;
  effects: Set<SymbolType>;
}

export const store = {
  enhancer: new Map<symbol, DxEnhancer>(),
  models: new Map<symbol, ModelRefs>(),
  reduxStore: new Map<symbol, Store>(),

  // 用来记录 action, 以方便判断 action 是否 effect
  actionTypes: new Map<symbol, StoreActionType>(),

  getModels(inst: symbol): ModelRefs {
    let models = store.models.get(inst);
    if (!models) {
      models = { set: new Set(), map: {} };
      store.models.set(inst, models);
    }
    return models;
  },
};
