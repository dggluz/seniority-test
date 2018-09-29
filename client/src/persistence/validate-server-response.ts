import { taskValidation } from "../utils/task-validation";

export class UnexpectedServerResponseError extends Error {
	UnexpectedServerResponseError = 'UnexpectedServerResponseError';

	constructor (public originalError: Error) {
		super(originalError.message);
	}
}

/**
 * Validates the server's response structure.
 * @param validation
 */
export const validateServerResponse = <A, B> (validation: (x: A) => B) =>
	taskValidation(validation, err => new UnexpectedServerResponseError(err))
;
