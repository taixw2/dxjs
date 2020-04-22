/* eslint-disable @typescript-eslint/no-explicit-any */
import { DxBase } from './base';
import { DxModelInterface, DxModelContstructor } from '@dxjs/shared/interfaces/dx-model.interface';

export class DxModel extends DxBase implements DxModelInterface {
  state = {};
}

export function isDxModel(model: any): model is DxModelContstructor {
  return model && model.prototype instanceof DxModel;
}
