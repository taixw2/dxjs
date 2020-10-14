/* eslint-disable @typescript-eslint/no-explicit-any */
import { MODEL_NAME } from '@dxjs/shared/symbol';
import { store } from '../../helper/store';
import { DxModel } from '../../dx-model/model';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
// eslint-disable-next-line @typescript-eslint/no-var-requires

export function collectFactory() {
  return (name?: string) => {
    return function Decorate(ModelTarget: { new (): DxModel }): { new (): DxModel } {
      if (__DEV__) {
        require('invariant')(
          ModelTarget.prototype instanceof DxModel,
          'collect model 必须继承自 DxModel, 当前 model 类型为 %s',
          typeof ModelTarget.prototype,
        );

        require('invariant')(!store.reduxStore, 'store 已经存在, 不能再 store 创建之后增加 model');
      }

      const models = store.getModels();
      const _name = name || ModelTarget.name;
      Reflect.defineMetadata(MODEL_NAME, _name, ModelTarget);
      models.map[_name] = ModelTarget;
      models.set.add(ModelTarget);
      return ModelTarget;
    };
  };
}
