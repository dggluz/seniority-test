import { Component } from '../component';
import { Item } from '../../model/item';
import { TextboxComponent } from '../textbox/textbox.component';
import { noop } from '../../utils/noop';

require('./item.component.less');

export class ItemComponent extends Component {
	private _model: Item;
	private _descriptionTextbox: TextboxComponent;

	constructor (model: Item) {
		super(require('./item.component.html'));

		this._model = model
			.subscribe('description', _ => {
				this._updateDescription();
			})
			.subscribe('image', _ => {
				this._updateImage();
			})
			.subscribe('delete', _ => {
				this._destroy();
			})
		;
		
		this._descriptionTextbox = new TextboxComponent({
			placeholder: 'Description...',
			description: 'The description for your item',
			label: 'Description',
			maxLength: 300,
			required: true
		}).appendTo(
			this.$dom.find('.description-textbox-wrapper').hide()
		);

		this
			._updateDescription()
			._updateImage()
		;
	}

	protected _setHandlers () {
		this.$dom.find('.delete').click(e => {
			e.preventDefault();
			this.getModel().delete();
		});

		this.$dom.find('.description-textbox-wrapper').submit(e => {
			e.preventDefault();
			this._model
				.setDescription(this._descriptionTextbox.getValue())
				// TODO: improve this
				// TODO: exit description edition mode on succes??
				.fork(console.error, noop)
			;
			this._exitDescriptionEditionMode();
		});

		this.$dom.find('.description-label').click(e => {
			e.preventDefault();
			this._enterDescriptionEditionMode();
		});

		return this;
	}

	private getModel () {
		return this._model;
	}

	private _updateDescription() {
		const description = this.getModel().getDescription();
		this.$dom.find('.description-label').text(description);
		this._descriptionTextbox.setValue(description);
		return this;
	}

	private _updateImage() {
		this
			.getModel()
			.getImageAsUrl()
			.fork(
				// TODO: handle error
				console.error,
				image =>
					this.$dom.find('.thumbnail').attr('src', image)
			);
		return this;
	}

	private _destroy () {
		this.$dom.remove();
		return this;
	}

	private _enterDescriptionEditionMode () {
		this.$dom.find('.description-label').hide();
		this.$dom.find('.description-textbox-wrapper').show();
		return this;
	}

	private _exitDescriptionEditionMode () {
		this.$dom.find('.description-label').show();
		this.$dom.find('.description-textbox-wrapper').hide();
		return this;
	}
}
