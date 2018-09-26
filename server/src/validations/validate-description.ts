import { rejectIf } from '../utils/reject-if';
import { BadRequestError } from '../http-errors';

export const validateDescription = (description: string) =>
	rejectIf<string, BadRequestError>(
		description => !/.{1,300}/.test(description),
		new BadRequestError(new Error('Description should be non-empty and shorter than 300 characters'))
	)(description)
;
