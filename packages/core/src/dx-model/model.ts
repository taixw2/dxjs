/* eslint-disable @typescript-eslint/no-explicit-any */
import { DxBase } from './base';

export interface DxModelContstructor {
  new (): DxModel;

  namespace: string;
}

export class DxModel extends DxBase {
  state = {};

  init() {
    // system init
  }
}

export function isDxModel(model: any): boolean {
  return model && model.prototype instanceof DxModel;
}
