export { Label } from './expand/label';
export { Effect } from './expand/effect';
export { Reducer } from './expand/reducer';
export { mark as Mark } from './mark';

import { TAKE_EVERY, TAKE_LEADING, TAKE_LATEST, THROTTLE } from '@dxjs/shared/symbol';

export const TakeEvery = TAKE_EVERY;
export const TakeLeading = TAKE_LEADING;
export const TakeLatest = TAKE_LATEST;
export const Throttle = THROTTLE;
