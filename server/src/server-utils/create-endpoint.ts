import { Task, UnknownError } from '@ts-task/task';
import { HttpError, InternalServerError } from '../http-errors';
import { Request, Response } from 'restify';
import { caseError, isInstanceOf } from '@ts-task/utils';
import { tap } from '../utils/tap';
import { logUnhandledError } from '../utils/log-unhandled-error';
import { noop } from '../utils/noop';

/**
 * Takes a controller function and sends its result to the client, managing errors.
 * @param controller function with the endpoint functionality, takes only a Request parameter
 * 					and should return a Task resolved with the response or rejected with an
 * 					HttpError or an UnknownError
 * @return function to set as an endpoint to the restify server (whith methods .get, .post, etc.).
 */
export const createEndpoint = <T> (controller: (req: Request) => Task<T, HttpError | UnknownError>) =>
	(req: Request, res: Response) =>
		controller(req)
			.map(tap(result => res.send(200, result)))
			.catch(
				caseError(
					isInstanceOf(HttpError),
					err => {
						res.send(err.errorCode, {
							error: err.errorMessage
						});
						return Task.resolve(void 0);
					})
			)
			.catch(err => {
				const internalServerError = new InternalServerError();
				res.send(internalServerError.errorCode, {
					error: internalServerError.errorMessage
				});
				return Task.reject(err);
			})
			.fork(logUnhandledError, noop)
;
