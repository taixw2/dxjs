// import { DxModelInterface } from './dx-model.interface';
import { Middleware } from 'redux';
import { EffectMiddleware } from 'redux-saga';
import { DxEnhancer } from './dx-enhancer.interface';
import { DxModelContstructor } from './dx-model.interface';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface CreateOption<T = any> extends DxEnhancer {
  models: DxModelContstructor[] | { [key: string]: DxModelContstructor };
  injects?: T[];
  middlewares?: Middleware[];
  sagaMiddlewares?: EffectMiddleware[];
}
