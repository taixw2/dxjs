/* eslint-disable @typescript-eslint/camelcase */
import { store } from '../../helper/store';
import { securityAccessMap } from '../../helper/sec-access-map';
import { MiddlewareAPI, AnyAction, Dispatch } from 'redux';

type MiddlewareyCurry = (next: Dispatch<AnyAction>) => (action: AnyAction) => AnyAction | Promise<unknown>;
export function promiseMiddleware(inst: symbol) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return <S = unknown, D extends Dispatch = Dispatch>(_: MiddlewareAPI<D, S>): MiddlewareyCurry => {
    return next => (action): AnyAction | Promise<unknown> => {
      const actionTypes = securityAccessMap(store.actionTypes, inst, { reducers: new Set(), effects: new Set() });
      if (actionTypes.effects.has(action.type)) {
        return new Promise((resolve, reject) => {
          next({
            ...action,
            __dxjs_resolve: resolve,
            __dxjs_reject: reject,
          });
        });
      }

      return next(action);
    };
  };
}
