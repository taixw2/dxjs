import { Store } from 'redux';
import { SymbolType } from '@dxjs/shared/symbol';
import { DxModelContstructor } from '../dx-model/model';
import { Hook } from '../dx/create-plugin';

interface ModelRefs {
  set: Set<DxModelContstructor>;
  map: { [key: string]: DxModelContstructor };
}

export const store = {
  // plugin
  plugins: new Map<Hook, unknown[]>(),

  // models
  models: {} as ModelRefs,

  reduxStore: null as Store | null,

  effectTypes: new Set<SymbolType>(),

  getModels(): ModelRefs {
    if (!store.models) {
      store.models = { set: new Set(), map: {} };
    }
    return store.models;
  },
};
