import { DxEnhancer } from '@dxjs/shared/interfaces/dx-enhancer.interface';
import { DxModelContstructor } from '@dxjs/shared/interfaces/dx-model.interface';
import { Store } from '@dxjs/shared/node_modules/redux';

interface ModelRefs {
  set: Set<DxModelContstructor>;
  map: { [key: string]: DxModelContstructor };
}

export const store = {
  enhancer: new Map<symbol, DxEnhancer>(),
  models: new Map<symbol, ModelRefs>(),
  reduxStore: new Map<symbol, Store>(),

  getModels(inst: symbol): ModelRefs {
    let models = store.models.get(inst);
    if (!models) {
      models = { set: new Set(), map: {} };
      store.models.set(inst, models);
    }
    return models;
  },
};
