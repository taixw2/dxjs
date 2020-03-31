import { CreateOption } from '@dxjs/common/interfaces/dx-create-option.interface';
import { SFC } from 'react';

export const DxFactory = () => {
  const models = new WeakMap();

  function create(option: CreateOption): SFC {
    console.log('create -> option', option);

    option.models.forEach(model => models.set(model, model));

    return (): null => null;
  }

  return {
    create,
  };
};

export const Dx = DxFactory();
