import { DxModelContstructor } from '@dxjs/shared/interfaces/dx-model.interface';
import { EnhancerFilter } from '@dxjs/shared/interfaces/dx-enhancer.interface';
import { LABEL } from '@dxjs/shared/symbol';

function isRegexp(pattern: unknown): pattern is RegExp {
  return pattern instanceof RegExp;
}

export function enhancerFilter<T>(Model: DxModelContstructor, enhancers: EnhancerFilter<T>[] = []): EnhancerFilter<T>[] {
  const labels: string[] = Reflect.getMetadata(LABEL, Model) ?? [];
  return enhancers.filter(enhancer => {
    const { exclude, include } = enhancer;
    if (typeof exclude === 'string') {
      return !labels.some(l => l === exclude);
    }
    if (isRegexp(exclude)) {
      return !labels.some(l => exclude.test(l));
    }
    if (include === '*') {
      return true;
    }
    if (typeof include === 'string') {
      return labels.some(l => l === include);
    }
    if (isRegexp(include)) {
      return labels.some(l => include.test(l));
    }
    return false;
  });
}
