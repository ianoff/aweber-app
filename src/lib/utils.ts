/**
 * Simple object check.
 * @param item
 * @returns {boolean}
 */
export function isObject(item: NonNullable<unknown>) {
  return item && typeof item === "object" && !Array.isArray(item);
}

/**
 * Deep merge two objects.
 * @param target
 * @param ...sources
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function deepMerge(target: any, ...sources: any[]) {
  if (!sources.length) return target;
  const source = sources.shift();

  if (isObject(target) && !!source && isObject(source)) {
    for (const key in source) {
      if (typeof key == "string" && !!source[key] && isObject(source[key])) {
        if (key && !target[key]) Object.assign(target, { [key]: {} });
        deepMerge(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }
  return deepMerge(target, ...sources);
}
