import 'reflect-metadata';
import 'es6-symbol';
import { DxFactory } from './dx';

export { DxModel } from './dx-model/model';
export { DxFactory };
export const Dx = DxFactory();
export const CollectModel = Dx.create;
export default Dx;
