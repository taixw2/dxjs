/* eslint-disable @typescript-eslint/no-explicit-any */
import { store } from '../helper/store';
import { REDUCER_METHODS_KEY, EFFECT_METHODS_META } from '@dxjs/shared/symbol';
import { AnyAction } from 'redux';
import { Dispatch } from 'react';

interface Effect {
  name: string;
  actionType: string;
}

export function createAction(dispatch: Dispatch<AnyAction>): void {
  const models = store.getModels();
  models.set.forEach(Model => {
    const reducers = Reflect.getMetadata(REDUCER_METHODS_KEY, Model) as [symbol, string][];
    const effects = Reflect.getMetadata(EFFECT_METHODS_META, Model) as Effect[];

    const reducersMap = new Map(reducers);
    if (reducersMap && reducersMap.size) {
      reducersMap.forEach((methodName, actionType) => {
        Reflect.set(Model, methodName, function action(payload: any, autoDispatch?: boolean): AnyAction | void {
          if (autoDispatch === false) {
            return { type: actionType, payload };
          }
          return dispatch({ type: actionType, payload });
        });
      });
    }

    if (effects && effects.length) {
      effects.forEach(({ name, actionType }) => {
        Reflect.set(Model, name, function action(payload: any, autoDispatch?: boolean): AnyAction | void {
          if (autoDispatch === false) {
            return { type: actionType, payload };
          }
          return dispatch({ type: actionType, payload });
        });
      });
    }
  });
}
