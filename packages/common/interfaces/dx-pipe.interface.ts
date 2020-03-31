interface PipeReturnType<T> {
  type: T;
}

export interface BasePipeInterface {
  pipe(
    next: () => PipeReturnType<'next'>,
    $return: () => PipeReturnType<'return'>,
    $throw: () => PipeReturnType<'throw'>,
  ): void;
}
