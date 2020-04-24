import { DxFactory, DxFactoryInterface } from './dx';
import { connect } from 'react-redux';

export { DxModel } from './dx-model/model';
export { DxFactory, connect };
export const Dx: DxFactoryInterface = DxFactory();
