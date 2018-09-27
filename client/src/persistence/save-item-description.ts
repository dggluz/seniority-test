import { Item } from '../model/item';
import { xhrTask } from '../utils/xhr-task';
import { apiDomain } from './api-domain';
import { validateServerResponse } from './validate-server-response';
import { itemContract } from './item-contract';

export const saveItemDescription = (item: Item) =>
	item.getId()
		.chain(itemId =>
			xhrTask({
				url: `${apiDomain}/items/${itemId}/description`,
				method: 'PATCH',
				data: {
					description: item.getDescription()
				}
			})
		)
		.chain(validateServerResponse(itemContract))
;