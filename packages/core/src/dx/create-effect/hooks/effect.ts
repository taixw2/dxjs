import { store } from '../../../helper/store';

function effectHook(context: any, iterator: Generator): Generator {
  const hook =
    (store.plugins.get('effect') as ((
      context: any,
      ref: {
        next: () => Generator;
        abort: (value: unknown) => void;
        throw: (value: unknown) => void;
        isDone: () => void;
      },
    ) => Generator)[]) ?? [];

  // 在 effect 上加一层包装
  return hook.reduce((effect, currentHook) => {
    let effectRef: unknown = undefined;
    let effectValue: unknown = undefined;

    function $throw(value: unknown): void {
      effect.throw(value);
    }

    function abort(value: unknown): void {
      effect.return(value);
    }

    function* next(): Generator {
      effectRef = effect.next(effectValue);
      effectValue = yield (effectRef as IteratorResult<any>).value;
      return effectValue;
    }

    function isDone(): boolean {
      if (effectRef === undefined) return false;
      return (effectRef as IteratorResult<any>).done ?? true;
    }

    const hookIterator = currentHook(context, { next, abort, throw: $throw, isDone });

    function* run(args?: unknown): Generator {
      const result = hookIterator.next(args);
      while (!result.done) {
        yield* run(result.value);
      }
    }

    return run();
  }, iterator);
}

export default effectHook;
