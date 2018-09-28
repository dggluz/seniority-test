import { Component } from '../component';
import { ItemComponent } from '../item/item.component';
import { itemsStore } from '../../model/model';
import Sortable = require('sortablejs');

require('./items-wrapper.component.less');

interface SortableEvent {
	newIndex: number;
	oldIndex: number;
}

export class ItemsWrapperComponent extends Component {
	constructor () {
		super(require('./items-wrapper.component.html'));

		itemsStore
			.subscribe('new-item', item => {
				new ItemComponent(item)
					.appendTo(this.$dom);
			})
			.subscribe('init', items => {
				// Append all the items to a fragment before inserting into the document
				// to reduce redrawings and improve performance
				const fragment = document.createDocumentFragment();
				items.forEach(anItem => {
					new ItemComponent(anItem)
						.appendTo(fragment);
				})
				this.$dom.empty().append(fragment);

				Sortable.create(this.$dom.get(0), {
					ghostClass: 'sortable-ghost',
					onEnd: (event: SortableEvent) => {
						itemsStore.sortItem(event.oldIndex, event.newIndex);
					}
				});
			})
		;
	}
}
