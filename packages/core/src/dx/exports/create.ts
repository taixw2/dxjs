import * as React from 'react';
import { CreateOption } from '@dxjs/shared/interfaces/dx-create-option.interface';
import { Provider } from 'react-redux';
import { createStoreFactory } from './create-store';

export function createFactory(inst: symbol) {
  return <T>(options?: CreateOption<T>): React.SFC => {
    const store = createStoreFactory(inst)(options);
    return <T>(props: React.PropsWithChildren<T>): React.ReactElement => {
      return React.createElement(Provider, { store, ...props });
    };
  };
}
