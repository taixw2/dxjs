/* eslint-disable @typescript-eslint/no-explicit-any */
import { DxBase } from './base';
import { DX_MODEL_NAME } from '@dxjs/common/shared';
import { DxModelInterface } from '@dxjs/common/interfaces/dx-model.interface';

export class DxModel extends DxBase implements DxModelInterface {
  [DX_MODEL_NAME]: symbol | string = Symbol('__DX_MODEL');
  state = {};
}
