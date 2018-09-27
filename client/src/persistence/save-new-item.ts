import { Item } from '../model/item';
import { apiDomain } from './api-domain';
import { xhrTask } from '../utils/xhr-task';

export const saveNewItem = (item: Item) => {
	item
		.getImageAsFile()
		.chain(imageFile => {
			const formData = new FormData();
			formData.append('description', item.getDescription());
			formData.append('image', imageFile);
		
			return xhrTask({
				url: `${apiDomain}/items`,
				method: 'POST',
				data: formData,
				// Needed to send a FormData:
				processData: false,
				contentType: false
			})
		})
		// TODO: extract into function to reuse between all requests savings
		.fork(
			// TODO: handle better errors
			console.error,
			// TODO: handle better success
			console.log
		)
	;
};
