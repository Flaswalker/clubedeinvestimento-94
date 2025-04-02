
/**
 * Utility function to await a promise and handle common operations on the resolved value
 */

// Filter a promise result once it resolves
export async function filterPromise<T>(
  promise: Promise<T[]>,
  predicate: (value: T) => boolean
): Promise<T[]> {
  const result = await promise;
  return result.filter(predicate);
}

// Map a promise result once it resolves
export async function mapPromise<T, R>(
  promise: Promise<T[]>,
  mapper: (value: T) => R
): Promise<R[]> {
  const result = await promise;
  return result.map(mapper);
}

// Find in a promise result once it resolves
export async function findPromise<T>(
  promise: Promise<T[]>,
  predicate: (value: T) => boolean
): Promise<T | undefined> {
  const result = await promise;
  return result.find(predicate);
}
