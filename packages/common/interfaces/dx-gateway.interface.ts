import { Action } from 'redux';

export interface BaseGateway {
  gateway(action: Action): void;
}
