/* eslint-disable @typescript-eslint/no-explicit-any */
import { DisguiserStatic, DisguiserInterface } from '@dxjs/shared/interfaces/dx-disguiser.interface';
import { EffectContextInterface } from '@dxjs/shared/interfaces/dx-effect-context.interface';
import { AnyAction } from 'redux';
import { DISGUISER_IO, DISGUISER_NEXT, DISGUISER_ABORT } from '@dxjs/shared/symbol';

export function composeDisguiser<T extends AnyAction>(context: EffectContextInterface<T>) {
  return function(iterator: Generator): Generator {
    return context.disguisers.reduce((effect: Generator, CurrentDisguiser: DisguiserStatic) => {
      const disguiser = new CurrentDisguiser(context);

      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      return proc(effect, disguiser);
    }, iterator);
  };
}

function* proc<T extends AnyAction>(iterator: Generator, disguiser: DisguiserInterface<T>): Generator {
  const disguiserRef = disguiser.disguiser();
  let previousValue: any;

  function* runIterator(): Generator {
    yield iterator.next(previousValue).value;
  }

  /**
   * 运行其中的一个 yield
   * 当出现 next 时，则运行一遍原始 effect 的 next
   */
  function* runDisguiser(value: any, callback: (arg?: any) => Generator): Generator {
    /**
     * 当 value 不是一个内定的 disguiser 时，则直接 yield
     */
    if (!value || !value[DISGUISER_IO]) {
      yield value;
      yield* callback(value);
      return;
    }

    if (value.type === DISGUISER_NEXT) {
      try {
        previousValue = yield* runIterator();
      } catch (error) {
        disguiserRef.throw(error);
      }
    }

    if (value.type === DISGUISER_ABORT) {
      iterator.return(undefined);
    }

    yield* callback(value);
  }

  /**
   * 递归这个 disguiser
   */
  function* runLoop(arg?: any): Generator {
    const result = disguiserRef.next(arg);
    if (!result.done) {
      yield* runDisguiser(result.value, runLoop);
    }
  }

  yield* runLoop();

  let iteratorResult = iterator.next(previousValue);
  while (!iteratorResult.done) {
    previousValue = yield iteratorResult.value;
    iteratorResult = iterator.next(previousValue);
  }

  return previousValue;
}
