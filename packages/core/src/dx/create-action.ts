/* eslint-disable @typescript-eslint/no-explicit-any */
import { store } from '../helper/store';
import { REDUCER_METHODS_KEY, EFFECT_METHODS_KEY } from '@dxjs/common/shared';
import { EffectTypeInterface } from '@dxjs/common/interfaces/dx-effect-type.interface';
import { AnyAction } from '@dxjs/common/node_modules/redux';
import { Dispatch } from 'react';

export function createAction(dispatch: Dispatch<AnyAction>, inst: symbol): void {
  const models = store.getModels(inst);
  models.set.forEach(Model => {
    // Reflect.set(Model, '', 1);
    const reducers = Reflect.getMetadata(REDUCER_METHODS_KEY, Model) as Map<symbol, string>;
    const effects = Reflect.getMetadata(EFFECT_METHODS_KEY, Model) as Set<EffectTypeInterface>;

    reducers.forEach((methodName, actionType) => {
      Reflect.set(Model, methodName, function action(payload: any): AnyAction {
        return { type: actionType, payload };
      });
      Reflect.set(
        Model,
        `dispatch${methodName.replace(/^\w/, m => m.toUpperCase())}`,
        function action(payload: any) {
          return dispatch({ type: actionType, payload });
        },
      );
    });

    effects.forEach(({ name, actionType }) => {
      Reflect.set(Model, name, function action(payload: any): AnyAction {
        return { type: actionType, payload };
      });
      Reflect.set(Model, `dispatch${name.replace(/^\w/, m => m.toUpperCase())}`, function action(
        payload: any,
      ) {
        return dispatch({ type: actionType, payload });
      });
    });
  });
}
