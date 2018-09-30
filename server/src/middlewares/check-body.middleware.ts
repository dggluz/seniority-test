import { BadRequestError } from '../http-errors';
import { taskValidation } from '../utils/task-validation';
import { overwrite } from '../utils/overwrite';

/**
 * This middleware takes a contract and validates that `req.body` matches the contract, typing it.
 * @param validation validation contract.
 */
export const checkBody = <A, B, R extends { body?: any }> (validation: (x: A) => B) =>
	(req: R) =>
		taskValidation(validation, err => new BadRequestError(err))(req.body)
			.map(body => overwrite(req, {body}))
;
