export function exclude<T, K extends keyof T>(
  obj: T,
  ...keys: K[]
): Omit<T, K> {
  const ObjDeepCopy: T = JSON.parse(JSON.stringify(obj));
  for (const key of keys) {
    delete ObjDeepCopy[key];
  }
  return ObjDeepCopy;
}
