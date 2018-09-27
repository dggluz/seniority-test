import { Item } from '../model/item';
import { apiDomain } from './api-domain';
import { xhrTask } from '../utils/xhr-task';
import { validateServerResponse } from './validate-server-response';
import { tap } from '../utils/tap';
import { itemContract } from './item-contract';
import { Task } from '@ts-task/task';

export const saveItemImage = (item: Item) =>
	Task
		.all([
			item.getImageAsFile(),
			item.getId()
		])
		.chain(([imageFile, itemId]) => {
			const formData = new FormData();
			formData.append('image', imageFile);
		
			return xhrTask({
				url: `${apiDomain}/items/${itemId}/image`,
				method: 'PATCH',
				data: formData,
				// Needed to send a FormData:
				processData: false,
				contentType: false
			})
		})
		.chain(validateServerResponse(itemContract))
		.map(tap(itemData =>
			item.setId(itemData._id)
		))
;
