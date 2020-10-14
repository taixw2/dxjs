import * as React from 'react';
import { Provider } from 'react-redux';
import { createStoreFactory } from '../create-store';
import { Middleware } from 'redux';
import { EffectMiddleware } from 'redux-saga';
import { DxModelContstructor } from '../../dx-model/model';
import { DxPlugin } from '../plugins/create-plugin';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface CreateOption<T = any> {
  models?: DxModelContstructor[] | { [key: string]: DxModelContstructor };
  injects?: T[];
  middlewares?: Middleware[];
  sagaMiddlewares?: EffectMiddleware[];
  plugins?: DxPlugin[];
  onSagaError?: (
    error: Error,
    errorInfo: {
      sagaStack: string;
    },
  ) => void;
}

export function createFactory() {
  return <T>(options?: CreateOption<T>): React.FunctionComponent => {
    const store = createStoreFactory()(options);
    return <T extends { store?: unknown }>({ children }: React.PropsWithChildren<T>): React.ReactElement => {
      return React.createElement(Provider, { store }, children);
    };
  };
}
