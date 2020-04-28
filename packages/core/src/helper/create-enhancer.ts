import { Enhancer, EnhancerFilter } from '@dxjs/shared/interfaces/dx-enhancer.interface';

const invariant = require('invariant');

function isEnhancerFilter<T>(enhancer: unknown): enhancer is EnhancerFilter<T> {
  return ['include', 'exclude', 'enhancer'].some(key => Reflect.has(enhancer as object, key));
}

export function createEnhancer<T>(enhancers?: Enhancer<T>[]): EnhancerFilter<T>[] {
  if (!enhancers) return [];
  return enhancers.map((enhancer: Enhancer<T>, i: number) => {
    if (!isEnhancerFilter(enhancer)) {
      return {
        include: '*',
        enhancer: enhancer,
      };
    }
    if (__DEV__) {
      invariant(
        Reflect.has(enhancer, 'enhancer'),
        '第 %s 个增强器必须包含 enhancer 属性, 当前类型为：%s',
        i,
        typeof enhancer,
      );
    }
    return {
      include: enhancer.include ?? '*',
      exclude: enhancer.exclude,
      enhancer: enhancer.enhancer,
    };
  });
}
