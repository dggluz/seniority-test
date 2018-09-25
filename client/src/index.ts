import { NewItemFormComponent } from './components/new-item-form/new-item-form.component';
import { ItemsWrapperComponent } from './components/items-wrapper/items-wrapper.component';

new NewItemFormComponent()
	.appendTo('.new-item-form-wrapper')
;

new ItemsWrapperComponent()
	.appendTo('.items-wrapper')
;
