import 'reflect-metadata';
import 'es6-symbol';

import { DxFactory, DxFactoryInterface } from './dx';
import { connect } from 'react-redux';

export { DxModel } from './dx-model/model';
export { Disguiser } from './dx-model/disguiser';
export { Guard } from './dx-model/guard';
export { Sentinel } from './dx-model/sentinel';
export { DxFactory, connect };
export const Dx: DxFactoryInterface = DxFactory();
