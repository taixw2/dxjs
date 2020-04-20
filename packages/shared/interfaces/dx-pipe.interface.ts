import { Action } from 'redux';

export interface BasePipeInterface {
  pipe(action: Action): Generator<unknown, boolean | void>;
}
