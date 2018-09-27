import { createEndpoint } from '../server-utils/create-endpoint';
import { getAllItems } from '../db/get-all-items';
import { caseError, isInstanceOf } from '@ts-task/utils';
import { isMongoError } from '../db/mongo-utils';
import { asUnknownError } from '@ts-task/task/dist/lib/src/operators';
import { FsError, SyntaxJSONError, InvalidJSONError } from '../fs-utils';
import { Task } from '@ts-task/task';
import { getItemWithImageUrl } from '../utils/get-item-with-image-url';

/**
 * Endpoint that returns all existing items
 */
export const getItemsCtrl = createEndpoint(_ =>
	getAllItems()
		.chain(items => Task.all(items.map(getItemWithImageUrl)))
		.catch(caseError(isMongoError, err => asUnknownError(err)))
		.catch(caseError(
			isInstanceOf(FsError, SyntaxJSONError, InvalidJSONError),
			err => asUnknownError(err)
		))
);
