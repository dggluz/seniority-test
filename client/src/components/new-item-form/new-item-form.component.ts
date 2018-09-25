import { Component } from '../component';
import { ImageFileLoaderComponent } from '../image-file-loader/image-file-loader.component';
import { itemsStore } from '../../model/model';
import { Item } from '../../model/item';

// TODO: move to a generic form component
export class NewItemFormComponent extends Component {
	private _imageFileSelector: ImageFileLoaderComponent;

	constructor () {
		super(require('./new-item-form.component.html'));
		this._imageFileSelector = new ImageFileLoaderComponent()
			.appendTo(this.$dom.find('.image-file-selector-wrapper'));
	}

	_setHandlers () {
		this.$dom.children('form').submit(e => {
			e.preventDefault();

			// TODO: change this
			const $description = this.$dom.find('#exampleInputEmail1');
			itemsStore.addItem(new Item(
				$description.val() as string,
				this._imageFileSelector.getImageFile()
			));
		});

		return this;
	}
}
