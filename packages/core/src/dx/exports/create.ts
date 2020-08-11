import * as React from 'react';
console.log('React', React.version);
import { CreateOption } from '@dxjs/shared/interfaces/dx-create-option.interface';
import { Provider } from 'react-redux';
import { createStoreFactory } from '../create-store';

export function createFactory() {
  return <T>(options?: CreateOption<T>): React.SFC => {
    const store = createStoreFactory()(options);
    return <T extends { store?: unknown }>({ children }: React.PropsWithChildren<T>): React.ReactElement => {
      return React.createElement(Provider, { store }, children);
    };
  };
}
