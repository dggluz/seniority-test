import { xhrTask } from '../utils/xhr-task';
import { Item } from '../model/item';
import { apiDomain } from './api-domain';

export const deleteItem = (item: Item) =>
	item
		.getId()
		.chain(itemId =>
			xhrTask({
				url: `${apiDomain}/items/${itemId}`,
				method: 'DELETE'
			})
		)
;
