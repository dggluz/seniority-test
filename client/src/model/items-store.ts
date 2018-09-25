import { Item } from './item';
import { Observable } from '../utils/observable.mixin';
import { EmptySuperClass } from '../utils/empty-super-class';
import { remove } from '../utils/remove';

export class ItemsStore extends Observable<{
	'new-item': Item;
	'remove-item': Item;
	'items-qty': number;
}>().from(EmptySuperClass) {
	_items: Item[] = [];

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

