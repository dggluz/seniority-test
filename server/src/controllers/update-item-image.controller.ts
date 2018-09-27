import { createEndpoint } from '../server-utils/create-endpoint';
import { Task } from '@ts-task/task';
import { checkParams } from '../middlewares/check-params.middleware';
import { objectOfLike, mongoIdLike } from '../utils/type-like';
import { tapChain } from '../utils/tap-chain';
import { findItem } from '../db/find-item';
import { caseError, isInstanceOf } from '@ts-task/utils';
import { MongoDocumentDoesNotExistError, isMongoError } from '../db/mongo-utils';
import { NotFoundError, BadRequestError } from '../http-errors';
import { asUnknownError } from '@ts-task/task/dist/lib/src/operators';
import { FsError, SyntaxJSONError, InvalidJSONError } from '../fs-utils';
import { updateItem } from '../db/update-item';
import { checkFiles } from '../middlewares/check-files.middleware';
import { validateImageSize, InvalidImageDimensions } from '../validations/validate-image-size';
import { FileExtensionError, saveImageAsStatic } from '../utils/save-image-as-static';
import { ImageSizeError } from '../utils/get-image-size';
import { deleteStaticImage } from '../utils/delete-static-image';

/**
 * Endpoint that updates an item's description.
 */
export const updateItemImageCtrl = createEndpoint(req =>
	Task
		.resolve(req)

		// Check we received the id
		.chain(checkParams(objectOfLike({
			itemId: mongoIdLike
		})))

		// Check we received the image
		.chain(checkFiles(['image']))

		// Validate image
		.chain(tapChain(req => validateImageSize(req.files.image.path)))

		// Update the item's image
		.chain(req => {
			// Gets item (or reject with MongoDocumentDoesNotExistError)
			return findItem({
				_id: req.params.itemId
			})
			.chain(item =>
				// Save image in filesystem
				saveImageAsStatic(req.files.image)
					// Updates item's image in DB
					.chain(newImagePath =>
						updateItem({
							_id: item._id
						}, {
							$set: {
								image: newImagePath
							}
						})
					)
					// Deletes old item's image
					.chain(_ =>
						deleteStaticImage(item.image)
							// Ignore error if we can't delete image
							.catch(
								caseError(isInstanceOf(FsError),
								err => {
									console.error('Could not delete item\'s image when updating it', err);
									return Task.resolve(undefined);
								})
							)
					)
			)
			// Return the item (to send it to the client)
			.chain(_ => findItem({
				_id: req.params.itemId
			}))
		})

		// Handle errors:
		// If the item doesn't exist, send 404
		.catch(caseError(
			isInstanceOf(MongoDocumentDoesNotExistError),
			_ => Task.reject(new NotFoundError('The document was not found'))
		))

		// Errors related to image handling will be considered BadRequestError
		.catch(caseError(
			isInstanceOf(
				FileExtensionError, InvalidImageDimensions, ImageSizeError),
			err => Task.reject(new BadRequestError(err))
		))
		
		// Other errors as treated as 500
		.catch(caseError(isMongoError, err => asUnknownError(err)))
		.catch(caseError(
			isInstanceOf(FsError, SyntaxJSONError, InvalidJSONError),
			err => asUnknownError(err)
		))
)
;