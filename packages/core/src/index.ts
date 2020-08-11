import 'reflect-metadata';
import 'es6-symbol';

import * as DxAction from '@dxjs/shared/interfaces/dx-action.interface';

export { DxModel } from './dx-model/model';
export { DxFactory, Dx } from './dx';
export { connect, useDispatch, useSelector, useStore, shallowEqual, batch, Provider } from 'react-redux';

export type Dispatch = DxAction.Dispatch;
