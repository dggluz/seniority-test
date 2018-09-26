import { Task } from '@ts-task/task';

/**
 * Used to execute a function that returns a Task, discarding its resolved value, but not the rejected errors.
 * @param fn Function that returns Task whose resolved value will be discarded.
 */
export const tapChain = <T, E> (fn: (x: T) => Task<any, E>) =>
	(x: T) =>
		fn(x)
			.map(_ => x)
;
