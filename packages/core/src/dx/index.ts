import { createFactory } from './exports/create';
import { modelsFactory } from './exports/models';
import { collectFactory } from './exports/collect';
import { createStoreFactory } from './create-store';
import { CreateOption } from '@dxjs/shared/interfaces/dx-create-option.interface';
import { Store, Action } from 'redux';
import * as React from 'react';
import { DxModelContstructor } from '@dxjs/shared/interfaces/dx-model.interface';

export interface DxFactoryInterface {
  createStore: <T>(options?: CreateOption<T>) => Store<{}, Action>;
  create: <T>(options?: CreateOption<T>) => React.SFC;
  getModels: {
    (): {
      [key: string]: DxModelContstructor;
    };
    (match: RegExp): DxModelContstructor[];
    (match: string): DxModelContstructor;
  };
  collect: (name?: string) => <T extends DxModelContstructor>(ModelTarget: T) => T;
  inst?: symbol;
}

export function DxFactory(): DxFactoryInterface {
  const inst = Symbol('__dx');

  return {
    createStore: createStoreFactory(inst),
    create: createFactory(inst),
    getModels: modelsFactory(inst),
    collect: collectFactory(inst),
    inst: process.env.NODE_ENV === 'test' ? inst : undefined,
  };
}

export const Dx = DxFactory();
