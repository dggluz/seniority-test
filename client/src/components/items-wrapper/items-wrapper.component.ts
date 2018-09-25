import { Component } from '../component';
import { ItemComponent } from '../item/item.component';
import { itemsStore } from '../../model/model';

export class ItemsWrapperComponent extends Component {
	constructor () {
		super(require('./items-wrapper.component.html'));

		itemsStore.subscribe('new-item', item => {
			new ItemComponent(item)
				.appendTo(this.$dom);
		});
	}
}
