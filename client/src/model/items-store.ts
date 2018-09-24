import { Item } from './item';
import { Observable } from '../utils/observable.mixin';
import { EmptySuperClass } from '../utils/empty-super-class';

export class ItemsStore extends Observable(EmptySuperClass) {
	_items: Item[] = [];

	addItem (item: Item) {
		this._items.push(item);
		this._notifyObservers('new-item', item);
		return this;
	}
}

