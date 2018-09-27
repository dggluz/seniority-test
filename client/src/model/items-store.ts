import { Item } from './item';
import { Observable } from '../utils/observable.mixin';
import { EmptySuperClass } from '../utils/empty-super-class';
import { remove } from '../utils/remove';
import { Task } from '@ts-task/task';
import { ItemData } from '../persistence/get-all-items';

export class ItemsStore extends Observable<{
	'init': Item[];
	'new-item': Item;
	'remove-item': Item;
	'items-qty': number;
}>().from(EmptySuperClass) {
	_items: Item[] = [];

	// TODO: improve typings
	init (itemsData: ItemData[]) {
		Task
			.all(itemsData.map(anItemData =>
				Item.create(anItemData.description, anItemData.image as any)
			))
			.fork(
				console.error,
				items => {
					this._items = items;
					this._notifyObservers('init', this.getItems());
				}
			);
		console.log(itemsData);
		return this;
	}

	addItem (item: Item) {
		this._items.push(item);
		this._notifyObservers('new-item', item);
		this._notifyObservers('items-qty', this.getItemsQty());
		return this;
	}

	removeItem (item: Item) {
		this._items = remove(item, this._items);
		this._notifyObservers('remove-item', item);
		this._notifyObservers('items-qty', this.getItemsQty());
		return this;
	}

	getItems() {
		return this._items;
	}

	getItemsQty () {
		return this.getItems().length;
	}
}

