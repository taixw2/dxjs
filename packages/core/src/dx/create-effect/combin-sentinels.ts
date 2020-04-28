import { EffectContextInterface, BaseEffectContextInterface } from '@dxjs/shared/interfaces/dx-effect-context.interface';
import { AnyAction } from 'redux';

export async function combinSentinels<T extends AnyAction>(context: EffectContextInterface<T>): Promise<boolean | void> {
  for (let index = 0; index < context.sentinels.length; index++) {
    const canNext = await context.sentinels[index](context as BaseEffectContextInterface<T>);
    if (canNext === false) return canNext;
  }
}
