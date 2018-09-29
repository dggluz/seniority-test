import { Component } from '../component';
import { NewItemFormComponent } from '../new-item-form/new-item-form.component';
import { ItemsTitleComponent } from '../items-title/items-title.component';
import { ItemsWrapperComponent } from '../items-wrapper/items-wrapper.component';
import { itemsStore } from '../../model/model';

const changeNoItemsState = (itemsQty: number) => {
	if (itemsQty) {
		$('.without-items').hide();
		$('.with-items').show();
	}
	else {
		$('.without-items').show();
		$('.with-items').hide();
	}
};

export class MainPageComponent extends Component {
	constructor () {
		super(require('./main.page.component.html'));

		new NewItemFormComponent()
			.appendTo(this.$dom.find('.new-item-form-wrapper'))
		;	
		
		new ItemsTitleComponent()
			.appendTo(this.$dom.find('.items-title-wrapper'))
		;	
		
		new ItemsWrapperComponent()
			.appendTo(this.$dom.find('.items-wrapper'))
		;	

		itemsStore
			.subscribe('items-qty', changeNoItemsState);
		;
	}
}
