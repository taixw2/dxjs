
import { SEP } from './const'

export const takeLatest = (target, key, descriptor) => {
  let _descriptor = descriptor;
  if (_descriptor === undefined) {
    _descriptor = Object.getOwnPropertyDescriptor(target, key);
  }
  target.__takelatest = [...(target.__takelatest || []), key]
  return _descriptor;
};

export const takeEvery = (target, key, descriptor) => {
  let _descriptor = descriptor;
  if (_descriptor === undefined) {
    _descriptor = Object.getOwnPropertyDescriptor(target, key);
  }
  target.__takeEvery = [...(target.__takeEvery || []), key]
  return _descriptor;
};

export const throttle = (target, key, descriptor) => {
  let _descriptor = descriptor;
  if (_descriptor === undefined) {
    _descriptor = Object.getOwnPropertyDescriptor(target, key);
  }
  target.__throttle = [...(target.__throttle || []), key]
  return _descriptor;
};

export const action = (ModelClass) => {
  const proto = ModelClass.prototype;
  const actions = Object.getOwnPropertyNames(proto);

  function prefix(type) {
    return `${ModelClass.name}${SEP}${type}`;
  }

  function createAction(method) {
    Reflect.set(ModelClass, method, payload => {
      return ({ type: prefix(method), payload })
    });
  }

  for (let index = 0; index < actions.length; index++) {
    const prop = actions[index];
    if (prop === 'constructor') continue;
    if (typeof proto[prop] === "function") {
      createAction(prop);
      continue
    }
  }

  return ModelClass
}
