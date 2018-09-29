import { itemsStore } from '../model/model';
import { saveNewItem } from './save-new-item';
import { getAllItems } from './get-all-items';
import { noop } from '../utils/noop';
import { deleteItem } from './delete-item';
import { Item } from '../model/item';
import { saveItemDescription } from './save-item-description';
import { saveItemImage } from './save-item-image';
import { saveItemOrder } from './save-item-order';
import { persistenceMonitor } from './persistence-monitor.instance';
import { tryToSave } from './try-to-save';

const subscribeToItemEvents = (item: Item) => {
	item
		.subscribe('description', _ => {
			tryToSave(() => saveItemDescription(item));
		})
		.subscribe('order', _ => {
			tryToSave(() => saveItemOrder(item));
		})
		.subscribe('image', _ => {
			tryToSave(() => saveItemImage(item));
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
					tryToSave(() => saveNewItem(newItem));
				})
				.subscribe('remove-item', item =>
					tryToSave(() => deleteItem(item))
				)
			;
		})
		.fork(
			err => {
				persistenceMonitor.showError();
				console.error(err);
			},
			noop
		)
	;
};
