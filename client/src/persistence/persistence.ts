import { itemsStore } from '../model/model';
import { saveNewItem } from './save-new-item';
import { getAllItems } from './get-all-items';
import { noop } from '../utils/noop';

export const initPersistence = () => {
	getAllItems()
		.map(itemsData => {
			itemsStore
				.init(itemsData)
				.subscribe('new-item', saveNewItem);
		})
		.fork(
			// TODO: improve error handling
			console.error,
			noop
		)
	;
};
