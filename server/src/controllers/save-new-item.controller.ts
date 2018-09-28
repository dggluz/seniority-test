import { Task } from '@ts-task/task';
import { createEndpoint } from '../server-utils/create-endpoint';
import { checkBody } from '../middlewares/check-body.middleware';
import { str } from 'parmenides';
import { checkFiles } from '../middlewares/check-files.middleware';
import { caseError, isInstanceOf } from '@ts-task/utils';
import { asUnknownError } from '@ts-task/task/dist/lib/src/operators';
import { FsError, SyntaxJSONError, InvalidJSONError } from '../fs-utils';
import { BadRequestError } from '../http-errors';
import { saveImageAsStatic, FileExtensionError } from '../utils/save-image-as-static';
import { isMongoError } from '../db/mongo-utils';
import { tapChain } from '../utils/tap-chain';
import { validateDescription } from '../validations/validate-description';
import { validateImageSize, InvalidImageDimensions } from '../validations/validate-image-size';
import { ImageSizeError } from '../utils/get-image-size';
import { saveNewItem } from '../db/save-new-item';
import { getItemWithImageUrl } from '../utils/get-item-with-image-url';
import { numberLike, objectOfLike } from '../utils/type-like';

/**
 * Endpoint that saves items to DB.
 */
export const saveNewItemCtrl = createEndpoint(req =>
	Task
		.resolve(req)

		// Check that we have a description
		.chain(checkBody(objectOfLike({
			description: str,
			order: numberLike
		})))

		// Check that we have an image file
		.chain(checkFiles(['image']))

		// validate description
		.chain(tapChain(req => validateDescription(req.body.description)))

		// validate image (size)
		.chain(tapChain(req => validateImageSize(req.files.image.path)))

		// Save item
		.chain(req =>
			// Save item's image
			saveImageAsStatic(req.files.image)
				// Save item to DB
				.chain(imageName => saveNewItem({
					description: req.body.description,
					image: imageName,
					order: req.body.order
				}))
				.chain(getItemWithImageUrl)
		)

		// Handle errors:
		// Errors related to image handling will be considered BadRequestError
		.catch(caseError(
			isInstanceOf(
				FileExtensionError, InvalidImageDimensions, ImageSizeError),
			err => Task.reject(new BadRequestError(err))
		))

		// Errors from reading files (configs and secrets) will be InternalServerError
		.catch(
			caseError(
				isInstanceOf(
					FsError,
					SyntaxJSONError,
					InvalidJSONError,
				),
				err => asUnknownError(err)
			)
		)

		// All DB errors will be InternalServerError
		.catch(
			caseError(
				isMongoError,
				err => asUnknownError(err)
			)
		)
	)
;
