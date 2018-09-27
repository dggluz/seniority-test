import { createEndpoint } from '../server-utils/create-endpoint';
import { Task } from '@ts-task/task';
import { checkParams } from '../middlewares/check-params.middleware';
import { objectOfLike, mongoIdLike } from '../utils/type-like';
import { checkBody } from '../middlewares/check-body.middleware';
import { strictObjOf, str } from 'parmenides';
import { tapChain } from '../utils/tap-chain';
import { validateDescription } from '../validations/validate-description';
import { findItem } from '../db/find-item';
import { caseError, isInstanceOf } from '@ts-task/utils';
import { MongoDocumentDoesNotExistError, isMongoError } from '../db/mongo-utils';
import { NotFoundError } from '../http-errors';
import { asUnknownError } from '@ts-task/task/dist/lib/src/operators';
import { FsError, SyntaxJSONError, InvalidJSONError } from '../fs-utils';
import { updateItem } from '../db/update-item';

/**
 * Endpoint that updates an item's description.
 */
export const updateItemDescriptionCtrl = createEndpoint(req =>
	Task
		.resolve(req)

		// Check we received the id
		.chain(checkParams(objectOfLike({
			itemId: mongoIdLike
		})))

		// Check we received the description
		.chain(checkBody(strictObjOf({
			description: str
		})))

		// Validate description
		.chain(tapChain(req => validateDescription(req.body.description)))

		// Validate item exists (or reject with MongoDocumentDoesNotExistError)
		.chain(tapChain(req => findItem({
			_id: req.params.itemId
		})))

		// Update the item's description
		.chain(req =>
			updateItem({
				_id: req.params.itemId
			}, {
				$set: {
					description: req.body.description
				}
			})

			// Return the item (to send it to the client)
			.chain(_ => findItem({
				_id: req.params.itemId
			}))
		)

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