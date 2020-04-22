export function securityAccessMap<T, R>(map: Map<T, R>, key: T, defaultValue: R): R {
  const value = map.get(key) ?? defaultValue;
  map.set(key, value);
  return value;
}
