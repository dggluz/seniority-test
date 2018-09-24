import { NewItemFormComponent } from './components/new-item-form/new-item-form.component';
import { itemsStore } from './model/model';

new NewItemFormComponent()
	.appendTo('.new-item-form-wrapper')
;

itemsStore.subscribe('new-item', item => console.log('nuevo item!', item));
