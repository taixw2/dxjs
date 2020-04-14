/* eslint-disable @typescript-eslint/no-explicit-any */
import { DxModelContstructor } from '@dxjs/shared/interfaces/dx-model.interface';
import { MODEL_NAME } from '@dxjs/shared/symbol';
import { store } from '../../helper/store';

export function collectFactory(inst: symbol) {
  return (name: string) => {
    return function Decorate(ModelTarget: DxModelContstructor): DxModelContstructor {
      const models = store.getModels(inst);
      const _name = name || ModelTarget.name;
      Reflect.defineMetadata(MODEL_NAME, _name, ModelTarget);
      models.map[_name] = ModelTarget;
      models.set.add(ModelTarget);
      return ModelTarget;
    };
  };
}
