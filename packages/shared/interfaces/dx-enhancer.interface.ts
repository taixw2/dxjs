/* eslint-disable @typescript-eslint/no-explicit-any */
interface ReducerEnhancer {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (...args: any[]): any;
}

export interface EnhancerFilter<T> {
  include?: string | RegExp;
  exclude?: string | RegExp;
  enhancer: T;
}

export type Enhancer<T> = EnhancerFilter<T> | T;

export interface DxEnhancer {
  reducerEnhancer?: Enhancer<ReducerEnhancer>[];
  sentinels?: any[];
  invaders?: any[];
  guards?: any[];
}
