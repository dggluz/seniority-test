import { Component } from '../component';
import { itemsStore } from '../../model/model';
import { ItemComponent } from '../item/item.component';

export class ItemsWrapperComponent extends Component {
	constructor () {
		super(require('./items-wrapper.component.html'));

		itemsStore.subscribe('new-item', item => {
			new ItemComponent(item)
				.appendTo(this.$dom);
		});
	}
}
