import { BadRequestError } from '../http-errors';
import { taskValidation } from '../utils/task-validation';
import { overwrite } from '../utils/overwrite';

export const checkBody = <A, B, R extends { body?: any }> (validation: (x: A) => B) =>
	(req: R) =>
		taskValidation(validation, err => new BadRequestError(err))(req.body)
			.map(body => overwrite(req, {body}))
;
