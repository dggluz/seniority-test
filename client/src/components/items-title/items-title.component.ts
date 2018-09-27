import { Component } from '../component';
import { itemsStore } from '../../model/model';

export class ItemsTitleComponent extends Component {
	constructor () {
		super(require('./items-title.component.html'));

		itemsStore
			.subscribe('items-qty', _ => {
				this._updateItemsQty();
			})
			.subscribe('init', _ => {
				this._updateItemsQty();
			})
		;
	}

	private _updateItemsQty () {
		this.$dom.find('.items-counter').text(itemsStore.getItemsQty());
		return this;
	}
}
