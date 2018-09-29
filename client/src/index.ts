import { NewItemFormComponent } from './components/new-item-form/new-item-form.component';
import { ItemsWrapperComponent } from './components/items-wrapper/items-wrapper.component';
import { ItemsTitleComponent } from './components/items-title/items-title.component';
import { initPersistence } from './persistence/persistence';
import { itemsStore } from './model/model';

new NewItemFormComponent()
	.appendTo('.new-item-form-wrapper')
;

new ItemsTitleComponent()
	.appendTo('.items-title-wrapper')
;

new ItemsWrapperComponent()
	.appendTo('.items-wrapper')
;

initPersistence();

///////////////////

const checkIfThereAreItems = (itemsQty: number) => {
	if (itemsQty) {
		$('.without-items').hide();
		$('.with-items').show();
	}
	else {
		$('.without-items').show();
		$('.with-items').hide();
	}
};

itemsStore
	.subscribe('items-qty', checkIfThereAreItems);
;
