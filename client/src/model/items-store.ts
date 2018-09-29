import { Item } from './item';
import { Observable } from '../utils/observable.mixin';
import { EmptySuperClass } from '../utils/empty-super-class';
import { remove } from '../utils/remove';
import { Task } from '@ts-task/task';
import { ItemData } from '../persistence/item-contract';
import { tap } from '../utils/tap';

/**
 * @class
 * Model item's store (a set of items).
 */
export class ItemsStore extends Observable<{
	'init': Item[];
	'new-item': Item;
	'remove-item': Item;
	'items-qty': number;
}>().from(EmptySuperClass) {
	_items: Item[] = [];

	init (itemsData: ItemData[]) {
		// Remove "if" when Task.all is fixed for empty arrays
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
						this._notifyObservers('items-qty', this.getItemsQty());
					}
				);
		}
		else {
			this._notifyObservers('init', this.getItems());
			this._notifyObservers('items-qty', this.getItemsQty());
		}
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
		return this._items
			.sort((anItem, anotherItem) =>
				anItem.getOrder() - anotherItem.getOrder()
			)
		;
	}

	getItemsQty () {
		return this.getItems().length;
	}

	sortItem (originalIndex: number, newIndex: number) {
		const items = this.getItems();
		const itemToMove = items[originalIndex];

		// If it has not really been move, do nothing
		if (originalIndex === newIndex) {
			return this;
		}

		if (originalIndex > newIndex) {
			const newFollowingItem = items[newIndex];
			const newPreviousItem = items[newIndex - 1];
			if (!newPreviousItem) {
				itemToMove.setOrder(newFollowingItem.getOrder() - 1);
			}
			else {
				itemToMove.setOrder((newPreviousItem.getOrder() + newFollowingItem.getOrder()) * 0.5);
			}
		}
		else {
			const newPreviousItem = items[newIndex];
			const newFollowingItem = items[newIndex + 1];
			if (!newFollowingItem) {
				itemToMove.setOrder(newPreviousItem.getOrder() + 1);
			}
			else {
				itemToMove.setOrder((newPreviousItem.getOrder() + newFollowingItem.getOrder()) * 0.5);
			}
		}

		return this;
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
