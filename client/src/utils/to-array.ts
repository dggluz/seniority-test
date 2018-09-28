/**
 * Transforms an array-like value into an actual array.
 * @param arrayLike
 */
export const toArray = <T> (arrayLike: ArrayLike<T>): T[] =>
	[].slice.call(arrayLike)
;
