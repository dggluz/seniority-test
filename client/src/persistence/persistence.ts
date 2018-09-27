import { itemsStore } from '../model/model';
import { saveNewItem } from './save-new-item';
import { getAllItems } from './get-all-items';
import { noop } from '../utils/noop';
import { deleteItem } from './delete-item';

export const initPersistence = () => {
	getAllItems()
		.map(itemsData => {
			itemsStore
				.init(itemsData)
				.subscribe('new-item', saveNewItem)
				.subscribe('remove-item', deleteItem)
			;
		})
		.fork(
			// TODO: improve error handling
			console.error,
			noop
		)
	;
};
