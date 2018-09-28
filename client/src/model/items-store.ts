import { Item } from './item';
import { Observable } from '../utils/observable.mixin';
import { EmptySuperClass } from '../utils/empty-super-class';
import { remove } from '../utils/remove';
import { Task } from '@ts-task/task';
import { ItemData } from '../persistence/item-contract';
import { tap } from '../utils/tap';

export class ItemsStore extends Observable<{
	'init': Item[];
	'new-item': Item;
	'remove-item': Item;
	'items-qty': number;
}>().from(EmptySuperClass) {
	_items: Item[] = [];

	// TODO: improve typings
	init (itemsData: ItemData[]) {
		// TODO: remove "if" when Task.all is fixed for empty arrays
		if (itemsData.length) {
			Task
				.all(itemsData.map(anItemData =>
					Item
						.create(anItemData.description, anItemData.image as any)
						.map(tap(item => item.setId(anItemData._id)))
						.map(tap(item => item.setOrder(anItemData.order)))
				))
				.fork(
					console.error,
					items => {
						this._items = items;
						this._notifyObservers('init', this.getItems());
					}
				);
		}
		else {
			this._notifyObservers('init', this.getItems());
		}
		console.log(itemsData);
		return this;
	}

	addItem (item: Item) {
		this._items.push(
			item
				.setOrder(this._getLastItemOrder() + 1)
			)
		;
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

	private _getLastItem (): Item | undefined {
		return this.getItems().slice(-1)[0];
	}

	private _getLastItemOrder () {
		const lastItem = this._getLastItem();
		if (lastItem) {
			return lastItem.getOrder();
		}
		return 0;
	}
}

