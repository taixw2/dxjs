import 'reflect-metadata';
import 'es6-symbol';
import { DxFactory, IDxFactory } from './dx';

export { connect } from "react-redux"
export { DxModel } from './dx-model/model';
export { DxFactory };
export const Dx: IDxFactory = DxFactory();

