
/**
 * Utility function to filter results from a promise
 * This is useful for filtering database results that come from promises
 */
export const filterPromise = async <T>(
  promise: Promise<T[]>,
  filterFn: (item: T) => boolean
): Promise<T[]> => {
  try {
    const data = await promise;
    return data.filter(filterFn);
  } catch (error) {
    console.error("Error in filterPromise:", error);
    throw error;
  }
};

/**
 * Utility function to map results from a promise
 */
export const mapPromise = async <T, R>(
  promise: Promise<T[]>,
  mapFn: (item: T) => R
): Promise<R[]> => {
  try {
    const data = await promise;
    return data.map(mapFn);
  } catch (error) {
    console.error("Error in mapPromise:", error);
    throw error;
  }
};

/**
 * Utility function to reduce results from a promise
 */
export const reducePromise = async <T, R>(
  promise: Promise<T[]>,
  reduceFn: (accumulator: R, item: T) => R,
  initialValue: R
): Promise<R> => {
  try {
    const data = await promise;
    return data.reduce(reduceFn, initialValue);
  } catch (error) {
    console.error("Error in reducePromise:", error);
    throw error;
  }
};
