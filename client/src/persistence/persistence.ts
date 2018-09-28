import { itemsStore } from '../model/model';
import { saveNewItem } from './save-new-item';
import { getAllItems } from './get-all-items';
import { noop } from '../utils/noop';
import { deleteItem } from './delete-item';
import { Item } from '../model/item';
import { saveItemDescription } from './save-item-description';
import { saveItemImage } from './save-item-image';
import { saveItemOrder } from './save-item-order';

const subscribeToItemEvents = (item: Item) => {
	item
	.subscribe('description', _ => {
		saveItemDescription(item)
			.fork(
				// TODO: improve error handling
				console.error,
				noop
			)
		;
	})
	.subscribe('order', _ => {
		saveItemOrder(item)
			.fork(
				// TODO: improve error handling
				console.error,
				noop
			)
		;
	})
	.subscribe('image', _ => {
			saveItemImage(item)
				.fork(
					// TODO: improve error handling
					console.error,
					noop
				)
			;
		})
	;
};

export const initPersistence = () => {
	itemsStore.subscribe('init', items => {
		items.forEach(subscribeToItemEvents);
	});

	getAllItems()
		.map(itemsData => {
			itemsStore
				.init(itemsData)
				.subscribe('new-item', newItem => {
					subscribeToItemEvents(newItem);
					saveNewItem(newItem);
				})
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
