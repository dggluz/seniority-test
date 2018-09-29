import { error } from 'toastr';
import { Task } from '@ts-task/task';
import { noop } from './noop';

export const tryOrShowError = <T> (fn: () => Task<T, any>, success?: (x: T) => void) =>
	fn()
		.fork(error, success || noop)
;
