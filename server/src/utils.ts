import { Task, UnknownError } from '@ts-task/task';
import { ParmenidesError } from 'parmenides';
import { Overwrite } from 'type-zoo';

/**
 * Takes a function that returns a sync result or throws an error and calls it from a
 * Task, handling the error if it is a ParmenidesError, with the errHandler function
 * @param validation function that takes a parameter and returns a sync value or throws ParmenidesError
 * @param errHandler function that takes a ParmenidesError and returns another Error
 * @returns Task to the validation result, possible rejected with the results of the errHandler
 */
export const taskValidation = <A, B, E> (validation: (x: A) => B, errHandler: (err: ParmenidesError) => E) =>
	(x: A): Task<B, E | UnknownError> => {
		try {
			return Task.resolve(validation(x));
		}
		catch(err) {
			return Task
				.reject(isParmenidesError(err) ?
					errHandler(err) :
					new UnknownError(err)
				)
		}
};

/**
 * Predicate to find out if an error is a ParmenidesError
 * @param err The error
 */
const isParmenidesError = (err: any): err is ParmenidesError =>
	err && err.ParmenidesError === 'ParmenidesError'
;

/**
 * Does nothing
 * @return undefined
 */
export const noop = () => undefined;

/**
 * Logs an error to the console
 * @param err 
 * @return undefined
 */
export const logUnhandledError = (err: Error) => {
	console.error('Unhandled error!', err);
};

/**
 * Calls `fn` performing its side effects but discarding its return value and returning the input parameter instead.
 * @param fn Unary function that performs side effects and whose return value will be discarded
 * @returns "tapped" `fn`
 */
export const tap = <T> (fn: (x: T) => any) =>
	(x: T) => {
		fn(x);
		return x;
	}
;

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

export const rejectIf = <T, E> (predicate: (x: T) => boolean, error: E) =>
	(x: T): Task<T, E> =>
		predicate(x) ?
			Task.reject(error) :
			Task.resolve(x)
;
