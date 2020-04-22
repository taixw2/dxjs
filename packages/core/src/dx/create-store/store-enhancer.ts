import { CreateOption } from '@dxjs/shared/interfaces/dx-create-option.interface';
import { store } from '../../helper/store';
import { createEnhancer } from './create-enhancer';

export function storeEnhancer(inst: symbol, options: CreateOption): void {
  store.enhancer.set(inst, {
    reducerEnhancer: createEnhancer(options.reducerEnhancer),
    sentinels: createEnhancer(options.sentinels),
    invaders: createEnhancer(options.invaders),
    guards: createEnhancer(options.guards),
  });
}
