/* eslint-disable @typescript-eslint/no-explicit-any */
import { store } from '../helper/store';
import { REDUCER_METHODS_KEY, EFFECT_METHODS_META } from '@dxjs/shared/symbol';
import { EffectTypeInterface } from '@dxjs/shared/interfaces/dx-effect-type.interface';
import { AnyAction } from 'redux';
import { Dispatch } from 'react';

export function createAction(inst: symbol, dispatch: Dispatch<AnyAction>): void {
  const models = store.getModels(inst);
  models.set.forEach(Model => {
    const reducers = Reflect.getMetadata(REDUCER_METHODS_KEY, Model) as Map<symbol, string>;
    const effects = Reflect.getMetadata(EFFECT_METHODS_META, Model) as Set<EffectTypeInterface>;

    if (reducers && reducers.size) {
      reducers.forEach((methodName, actionType) => {
        Reflect.set(Model, methodName, function action(payload: any, autoDispatch?: boolean): AnyAction | void {
          if (autoDispatch) {
            return dispatch({ type: actionType, payload });
          }
          return { type: actionType, payload };
        });
      });
    }

    if (effects && effects.size) {
      effects.forEach(({ name, actionType }) => {
        Reflect.set(Model, name, function action(payload: any, autoDispatch?: boolean): AnyAction | void {
          if (autoDispatch) {
            return dispatch({ type: actionType, payload });
          }
          return { type: actionType, payload };
        });
      });
    }
  });
}
