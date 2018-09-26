import { Task } from '@ts-task/task';
import { createEndpoint } from '../server-utils/create-endpoint';
import { checkBody } from '../middlewares/check-body.middleware';
import { strictObjOf, str } from 'parmenides';
import { checkFiles } from '../middlewares/check-files.middleware';
import { caseError, isInstanceOf } from '@ts-task/utils';
import { asUnknownError } from '@ts-task/task/dist/lib/src/operators';
import { FsError, SyntaxJSONError, InvalidJSONError } from '../fs-utils';
import { BadRequestError } from '../http-errors';
import { saveImageAsStatic, FileExtensionError } from '../utils/save-image-as-static';

/**
 * Endpoint that just response with a dummy object. Useful for checking if the server is alive.
 */
export const saveNewItemCtrl = createEndpoint(req =>
	Task
		.resolve(req)
		.chain(checkBody(strictObjOf({
			description: str
		})))
		.chain(checkFiles(['image']))
		// TODO: validate image (size)
		// TODO: validate description

		.chain(req => saveImageAsStatic(req.files.image))

		// TODO: save data
		.map(imageName => ({
			ok: true,
			image: imageName
		}))
	.catch(caseError(isInstanceOf(FileExtensionError), err => Task.reject(new BadRequestError(err))))
	.catch(
		caseError(
			isInstanceOf(
				FsError,
				SyntaxJSONError,
				InvalidJSONError
			),
			err => asUnknownError(err)
		)
	)
);
