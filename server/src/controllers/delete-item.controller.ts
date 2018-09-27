import { Task } from '@ts-task/task';
import { createEndpoint } from '../server-utils/create-endpoint';
import { checkBody } from '../middlewares/check-body.middleware';
import { objectOfLike, mongoIdLike } from '../utils/type-like';
import { findItem } from '../db/find-item';
import { caseError, isInstanceOf } from '@ts-task/utils';
import { NotFoundError } from '../http-errors';
import { MongoDocumentDoesNotExistError, isMongoError } from '../db/mongo-utils';
import { asUnknownError } from '@ts-task/task/dist/lib/src/operators';
import { FsError, SyntaxJSONError, InvalidJSONError } from '../fs-utils';
import { deleteItem } from '../db/delete-item';
import { deleteStaticImage } from '../utils/delete-static-image';

/**
 * Endpoint that deletes an item by id.
 */
export const deleteItemCtrl = createEndpoint(req =>
	Task
		.resolve(req)

		// Check we received a MongoId
		.chain(checkBody(objectOfLike({
			_id: mongoIdLike
		})))

		// Find the item to obtain its image
		.chain(req => findItem({
			_id: req.body._id
		}))

		// Delete item and image
		.chain(item => {
			// First attempt to delete the document and then the image, since it's better to
			// have an extra image in the filesystem that an Item without its image file.
			return deleteItem(item._id)
				.chain(_ => deleteStaticImage(item.image));
		})

		// Server's response
		.map(_ => ({
			status: 'ok'
		}))

		// Handle errors:
		// If the item doesn't exist, send 404
		.catch(caseError(
			isInstanceOf(MongoDocumentDoesNotExistError),
			_ => Task.reject(new NotFoundError('The document was not found'))
		))
		// Other errors as treated as 500
		.catch(caseError(isMongoError, err => asUnknownError(err)))
		.catch(caseError(
			isInstanceOf(FsError, SyntaxJSONError, InvalidJSONError),
			err => asUnknownError(err)
		))
	)
;
