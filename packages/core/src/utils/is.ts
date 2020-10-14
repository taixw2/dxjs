interface IsGeneratorExtend extends Function {
  isGenerator(): boolean;
}

export function isClass<T>(fn: unknown): fn is T {
  return typeof fn === 'function' && !!fn.toString().match(/^class/);
}

export function isGenerator(fn?: IsGeneratorExtend | Function): fn is GeneratorFunction {
  if (!fn) return false;
  if ('isGenerator' in fn) return fn.isGenerator();
  return fn.constructor && 'GeneratorFunction' == fn.constructor.name;
}
