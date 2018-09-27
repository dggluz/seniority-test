import { taskValidation } from "../utils/task-validation";

export class UnexpectedServerResponseError extends Error {
	UnexpectedServerResponseError = 'UnexpectedServerResponseError';

	constructor (public originalError: Error) {
		super(originalError.message);
	}
}

export const validateServerResponse = <A, B> (validation: (x: A) => B) =>
	taskValidation(validation, err => new UnexpectedServerResponseError(err))
;