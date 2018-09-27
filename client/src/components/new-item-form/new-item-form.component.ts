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

	protected _setHandlers () {
		this.$dom.children('form').submit(e => {
			e.preventDefault();

			// TODO: change this
			const $description = this.$dom.find('#exampleInputEmail1');
			Item.create(
				$description.val() as string,
				this._imageFileSelector.getImageFile()
			).fork(_err => {
				// TODO: handle errors
			}, item => {
				itemsStore.addItem(item);
				this._restart();
			});
		});

		return this;
	}

	private _restart () {
		this._imageFileSelector.restart();
		// TODO: change this
		this.$dom.find('#exampleInputEmail1').val('');
		return this;
	}
}
