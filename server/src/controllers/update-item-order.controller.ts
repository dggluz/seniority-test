import { createEndpoint } from '../server-utils/create-endpoint';
import { Task } from '@ts-task/task';
import { checkParams } from '../middlewares/check-params.middleware';
import { objectOfLike, mongoIdLike, numberLike } from '../utils/type-like';
import { checkBody } from '../middlewares/check-body.middleware';
import { tapChain } from '../utils/tap-chain';
import { findItem } from '../db/find-item';
import { caseError, isInstanceOf } from '@ts-task/utils';
import { MongoDocumentDoesNotExistError, isMongoError } from '../db/mongo-utils';
import { NotFoundError } from '../http-errors';
import { asUnknownError } from '@ts-task/task/dist/lib/src/operators';
import { FsError, SyntaxJSONError, InvalidJSONError } from '../fs-utils';
import { updateItem } from '../db/update-item';

/**
 * Endpoint that updates an item's order.
 */
export const updateItemOrderCtrl = createEndpoint(req =>
	Task
		.resolve(req)

		// Check we received the id
		.chain(checkParams(objectOfLike({
			itemId: mongoIdLike
		})))

		// Check we received the order
		.chain(checkBody(objectOfLike({
			order: numberLike
		})))

		// Validate item exists (or reject with MongoDocumentDoesNotExistError)
		.chain(tapChain(req => findItem({
			_id: req.params.itemId
		})))

		// Update the item's order
		.chain(req =>
			updateItem({
				_id: req.params.itemId
			}, {
				$set: {
					order: req.body.order
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