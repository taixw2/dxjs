/* eslint-disable @typescript-eslint/indent */
import { Middleware } from 'redux';
import { EffectMiddleware } from 'redux-saga';
import { DxModelContstructor } from './dx-model.interface';
import { DxPlugin } from './dx-plugin.interface';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface CreateOption<T = any> {
  models?:
    | DxModelContstructor[]
    | { [key: string]: DxModelContstructor }
    | Array<DxModelContstructor | { [key: string]: DxModelContstructor }>;
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
