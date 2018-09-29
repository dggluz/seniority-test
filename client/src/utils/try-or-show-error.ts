import { error } from 'toastr';
import { Task } from '@ts-task/task';
import { noop } from './noop';

/**
 * Takes a Task, forks it and shows the rejected error with a toastr label.
 * If success, executes the opctional success callback.
 * @param fn
 * @param success
 */
export const tryOrShowError = <T> (fn: () => Task<T, any>, success?: (x: T) => void) =>
	fn()
		.fork(error, success || noop)
;
