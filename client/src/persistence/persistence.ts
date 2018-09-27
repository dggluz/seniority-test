import { itemsStore } from '../model/model';
import { saveNewItem } from './save-new-item';
import { getAllItems } from './get-all-items';

export const initPersistence = () => {
	getAllItems()
		.fork(
			// TODO: improve error handling
			console.error,
			itemsData => {
				itemsStore
					.init(itemsData)
					.subscribe('new-item', saveNewItem);
			}
		)
	;
};
