import { DxModelInterface } from './dx-model.interface';
import { ReducerEnhancer } from './dx-reducer-enhancer.interface';
import { Middleware } from 'redux';
import { BaseGateway as BaseGatewayInterface } from './dx-gateway.interface';
import { BasePipeInterface } from './dx-pipe.interface';
import { BaseGuardInterface } from './dx-guard.interface';

export interface CreateOption<T = any> {
  models: DxModelInterface<T>[];
  reducerEnhancer?: ReducerEnhancer[];
  middlewares?: Middleware[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  injects?: any[];
  gateways?: BaseGatewayInterface[];
  pipes?: BasePipeInterface[];
  guards?: BaseGuardInterface[];
}
