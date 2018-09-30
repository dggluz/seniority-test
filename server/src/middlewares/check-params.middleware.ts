import { BadRequestError } from '../http-errors';
import { taskValidation } from '../utils/task-validation';
import { overwrite } from '../utils/overwrite';

/**
 * This middleware takes a contract and validates that `req.params` matches the contract, typing it.
 * @param validation validation contract.
 */
export const checkParams = <A, B, R extends { params?: any }> (validation: (x: A) => B) =>
	(req: R) =>
		taskValidation(validation, err => new BadRequestError(err))(req.params)
			.map(params => overwrite(req, {params}))
;
