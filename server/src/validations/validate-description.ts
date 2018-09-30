import { rejectIf } from '../utils/reject-if';
import { BadRequestError } from '../http-errors';

/**
 * Validates that the description is present and that has 300 characters as maximum. Returns a Task
 * that is rejected if the validation fails.
 * @param description
 */
export const validateDescription = (description: string) =>
	rejectIf<string, BadRequestError>(
		description => !/.{1,300}/.test(description),
		new BadRequestError(new Error('Description should be non-empty and shorter than 300 characters'))
	)(description)
;
