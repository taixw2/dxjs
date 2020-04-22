interface IsGeneratorExtend extends Function {
  isGenerator?(): boolean;
}

export function isGenerator(fn?: IsGeneratorExtend) {
  if (!fn) return false;
  if ('isGenerator' in Function.prototype) return fn.isGenerator?.();
  return fn.constructor && 'GeneratorFunction' == fn.constructor.name;
}
