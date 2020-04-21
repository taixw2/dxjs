import 'reflect-metadata';
import { DxFactory, IDxFactory } from './dx';

export { connect } from 'react-redux';
export { DxModel } from './dx-model/model';
export { DxFactory };
export const Dx: IDxFactory = DxFactory();
