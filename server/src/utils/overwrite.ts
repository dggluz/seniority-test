import { Overwrite } from 'type-zoo/types';

/**
 * Overwrite takes two objects and returns a new one, that is like the first one,
 * overwritten with the second one. Mantains prototype chain of the firs object (in the result).
 * @param target original object
 * @param source object with the properties to overwrite
 * @returns "merged" object
 */
export const overwrite = <A, B> (target: A, source: B) =>
	Object.assign(
		Object.create(target.constructor.prototype),
		target,
		source
	) as any as Overwrite<A, B>
;
