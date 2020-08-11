import { store } from '../../../helper/store';

function effectHook<T>(context: T, iterator: Generator): Generator {
  const hook =
    (store.plugins.get('effect') as (<T>(
      context: T,
      ref: { next: () => Generator; abort: (value: unknown) => void; throw: (value: unknown) => void },
    ) => Generator)[]) ?? [];

  // 在 effect 上加一层包装
  return hook.reduce((effect, currentHook) => {
    let prevalue: unknown = undefined;

    function $throw(value: unknown): void {
      effect.throw(value);
    }

    function abort(value: unknown): void {
      effect.return(value);
    }

    function* next(): Generator {
      prevalue = yield effect.next(prevalue).value;
      return prevalue;
    }

    const hookIterator = currentHook(context, { next, abort, throw: $throw });

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
