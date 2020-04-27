import { CreateOption } from '@dxjs/shared/interfaces/dx-create-option.interface';
import { Action, Store } from 'redux';
import { store } from '../../helper/store';
import { storeModel } from './store-model';
import { storeEnhancer } from './store-enhancer';
import { combinStore } from './create-store';

export function createStoreFactory(inst: symbol) {
  return <T>(options: CreateOption<T> = {}): Store<{}, Action> => {
    const previousStore = store.reduxStore.get(inst);
    if (previousStore) return previousStore;

    // 收集全局 enhancer
    storeEnhancer(inst, options);

    // 收集 model
    storeModel(inst, options);

    // 生成 store
    return combinStore(inst, options);
  };
}
