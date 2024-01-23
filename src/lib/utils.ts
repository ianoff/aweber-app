/**
 * Simple object check.
 * @param item
 * @returns {boolean}
 */
export function isObject(item: NonNullable<unknown>) {
  return item && typeof item === "object" && !Array.isArray(item);
}

// This is probably exclusing some edge cases but I'm fine with it f
type BasicObject = {
  [key: NonNullable<string | number>]: NonNullable<unknown>;
};

/**
 * Deep merge two objects.
 * @param target
 * @param ...sources
 */
export function deepMerge(target: BasicObject, ...sources: BasicObject[]) {
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

export const debounce = (
  callback: (...args: NonNullable<unknown>[]) => void,
  wait: number
) => {
  let timeoutId: number;
  return (...args: NonNullable<unknown>[]) => {
    window.clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => {
      callback([...args]);
    }, wait);
  };
};
