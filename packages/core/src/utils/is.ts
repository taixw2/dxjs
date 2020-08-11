import { ClassPlugin } from '@dxjs/shared/interfaces/dx-plugin.interface';

interface IsGeneratorExtend extends Function {
  isGenerator(): boolean;
}

export function isClassPlugin(fn: unknown): fn is { new (): ClassPlugin } {
  return typeof fn === 'function' && !!fn.toString().match(/^class/);
}

export function isGenerator(fn?: IsGeneratorExtend | Function): fn is GeneratorFunction {
  if (!fn) return false;
  if ('isGenerator' in fn) return fn.isGenerator();
  return fn.constructor && 'GeneratorFunction' == fn.constructor.name;
}
