import { Component } from '../component';
import { ImageFileLoaderComponent } from '../image-file-loader/image-file-loader.component';
import { itemsStore } from '../../model/model';
import { Item } from '../../model/item';
import { TextboxComponent } from '../textbox/textbox.component';

// TODO: move to a generic form component
export class NewItemFormComponent extends Component {
	private _imageFileSelector: ImageFileLoaderComponent;
	private _description: TextboxComponent;

	constructor () {
		super(require('./new-item-form.component.html'));
		this._imageFileSelector = new ImageFileLoaderComponent()
			.appendTo(this.$dom.find('.image-file-selector-wrapper'))
		;

		this._description = new TextboxComponent({
			placeholder: 'Description...',
			description: 'The description for your item',
			label: 'Description'
		})
			.appendTo(this.$dom.find('.description-wrapper'))
		;
	}

	protected _setHandlers () {
		this.$dom.children('form').submit(e => {
			e.preventDefault();

			Item.create(
				this._description.getValue(),
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
		this._description.setValue('');
		return this;
	}
}
