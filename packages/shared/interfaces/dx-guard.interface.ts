import { Action } from 'redux';

export interface BaseGuardInterface {
  guard(action: Action): void;
}
