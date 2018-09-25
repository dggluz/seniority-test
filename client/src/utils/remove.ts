export const remove = <T> (element: T, from: T[]) => {
	const copy = from.slice(0);
	while (copy.indexOf(element) !== -1) {
		copy.splice(copy.indexOf(element), 1);
	}
	return copy;
};
