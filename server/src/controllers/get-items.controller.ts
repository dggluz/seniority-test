import { createEndpoint } from '../server-utils/create-endpoint';
import { getAllItems } from '../db/get-all-items';
import { caseError, isInstanceOf } from '@ts-task/utils';
import { isMongoError } from '../db/mongo-utils';
import { asUnknownError } from '@ts-task/task/dist/lib/src/operators';
import { FsError, SyntaxJSONError, InvalidJSONError } from '../fs-utils';

/**
 * Endpoint that returns all existing items
 */
export const getItemsCtrl = createEndpoint(_ =>
	getAllItems()
		.map(items =>
			items.map(item => ({
				...item,
				image: `./images/${item.image}`
			}))
		)
		.catch(caseError(isMongoError, err => asUnknownError(err)))
		.catch(caseError(
			isInstanceOf(FsError, SyntaxJSONError, InvalidJSONError),
			err => asUnknownError(err)
		))
);
