import { store } from '../../helper/store';
import { CreateOption } from '@dxjs/shared/interfaces/dx-create-option.interface';
import { isDxModel } from '../../dx-model/model';
import { MODEL_NAME, SymbolType } from '@dxjs/shared/symbol';
import { DxModelContstructor } from '@dxjs/shared/interfaces/dx-model.interface';
const invariant = require('invariant');

export function storeModel(inst: symbol, options: CreateOption): void {
  const models = store.getModels(inst);

  function collectModel(name: SymbolType, Model: DxModelContstructor): void {
    if (__DEV__) {
      invariant(isDxModel(Model), '%s 不是一个有效的 DxModel, ', Model?.name ?? typeof Model);
    }
    Reflect.defineMetadata(MODEL_NAME, name, Model);
    models.map[Model.name] = Model;
    models.set.add(Model);
  }

  function modelsWithObject(withObject?: { [key: string]: DxModelContstructor }): void {
    if (typeof withObject === 'undefined') return;
    if (__DEV__) {
      invariant(typeof withObject === 'object', 'models 不是一个有效的类型 %s, 请传入数组或对象', typeof withObject);
    }
    Object.keys(withObject).forEach(key => collectModel(key, withObject[key]));
  }

  if (Array.isArray(options.models)) {
    let ModelConstructor;
    while ((ModelConstructor = options?.models.shift())) {
      if (isDxModel(ModelConstructor)) {
        collectModel(ModelConstructor.name, ModelConstructor);
        continue;
      }
      modelsWithObject(ModelConstructor);
    }
  } else {
    modelsWithObject(options.models);
  }
}
