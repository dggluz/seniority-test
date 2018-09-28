import { Item } from '../model/item';
import { xhrTask } from '../utils/xhr-task';
import { apiDomain } from './api-domain';
import { validateServerResponse } from './validate-server-response';
import { itemContract } from './item-contract';

export const saveItemOrder = (item: Item) =>
	item.getId()
		.chain(itemId =>
			xhrTask({
				url: `${apiDomain}/items/${itemId}/order`,
				method: 'PATCH',
				data: {
					order: item.getOrder()
				}
			})
		)
		.chain(validateServerResponse(itemContract))
;
