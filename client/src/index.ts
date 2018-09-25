import { NewItemFormComponent } from './components/new-item-form/new-item-form.component';
import { ItemsWrapperComponent } from './components/items-wrapper/items-wrapper.component';
import { ItemsTitleComponent } from './components/items-title/items-title.component';

new NewItemFormComponent()
	.appendTo('.new-item-form-wrapper')
;

new ItemsTitleComponent()
	.appendTo('.items-title-wrapper')
;

new ItemsWrapperComponent()
	.appendTo('.items-wrapper')
;
