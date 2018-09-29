/**
 * Removes an item all ocurrences from an array and return the new array (doesn't modify the original).
 * @param element
 * @param from
 */
export const remove = <T> (element: T, from: T[]) => {
	const copy = from.slice(0);
	while (copy.indexOf(element) !== -1) {
		copy.splice(copy.indexOf(element), 1);
	}
	return copy;
};
