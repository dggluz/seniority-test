import { createEndpoint } from '../server-utils/create-endpoint';
import { getAllItems } from '../db/get-all-items';
import { caseError, isInstanceOf } from '@ts-task/utils';
import { isMongoError } from '../db/mongo-utils';
import { asUnknownError } from '@ts-task/task/dist/lib/src/operators';
import { FsError, SyntaxJSONError, InvalidJSONError } from '../fs-utils';
import { Task } from '@ts-task/task';
import { configs } from '../configs';

/**
 * Endpoint that returns all existing items
 */
export const getItemsCtrl = createEndpoint(_ =>
	Task
		.all([
			getAllItems(),
			configs
		])
		.map(([items, configs]) =>
			items.map(item => ({
				...item,
				image: `./${configs.static.namespace}/images/${item.image}`
			}))
		)
		.catch(caseError(isMongoError, err => asUnknownError(err)))
		.catch(caseError(
			isInstanceOf(FsError, SyntaxJSONError, InvalidJSONError),
			err => asUnknownError(err)
		))
);
