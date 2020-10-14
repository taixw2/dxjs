import * as React from 'react';
import { Provider } from 'react-redux';
import { createStoreFactory } from '../create-store';
import { Middleware } from 'redux';
import { EffectMiddleware } from 'redux-saga';
import { DxModelContstructor } from '../../dx-model/model';
import { DxPlugin } from '../create-plugin';

export interface CreateOption {
  models?: DxModelContstructor[] | { [key: string]: DxModelContstructor };
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
  return (options?: CreateOption): React.FunctionComponent => {
    const store = createStoreFactory()(options);
    return ({ children }: React.PropsWithChildren<{}>) => React.createElement(Provider, { store }, children);
  };
}
