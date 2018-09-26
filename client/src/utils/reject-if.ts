import { Task } from '@ts-task/task';

export const rejectIf = <T, E> (predicate: (x: T) => boolean, error: E) =>
	(x: T): Task<T, E> =>
		predicate(x) ?
			Task.reject(error) :
			Task.resolve(x)
;
