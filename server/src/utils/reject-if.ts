import { Task } from '@ts-task/task';

/**
 * Util function to use with `Task.chain`. It takes a predicate and an error.
 * Rejects the Task if the predicate evaluates to true, leaves it as it is otherwise.
 * @param predicate
 * @param error
 */
export const rejectIf = <T, E> (predicate: (x: T) => boolean, error: E) =>
	(x: T): Task<T, E> =>
		predicate(x) ?
			Task.reject(error) :
			Task.resolve(x)
;
