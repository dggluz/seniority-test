import { Component } from '../component';
import { Item } from '../../model/item';
import { TextboxComponent } from '../textbox/textbox.component';
import { as } from '../../utils/as';
import { validateOrReportSingleImageFile } from '../../utils/validate-or-report-single-image-file';
import { tryOrShowError } from '../../utils/try-or-show-error';
import { tap } from '../../utils/tap';

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
			tryOrShowError(() =>
				this._model.setDescription(this._descriptionTextbox.getValue())
			);
			this._exitDescriptionEditionMode();
		});

		this.$dom.find('.description-label').click(e => {
			e.preventDefault();
			this._enterDescriptionEditionMode();
		});

		this.$dom.find('.image-selector').change(e => {
			e.preventDefault();
			const files = as(HTMLInputElement)(this.$dom.find('.image-selector').get(0)).files;
			const image = files && validateOrReportSingleImageFile(files);
			if (image) {
				tryOrShowError(() => this._model.setImage(image));
			}
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
		tryOrShowError(() =>
			this
				.getModel()
				.getImageAsUrl()
				.map(tap(imageUrl =>
					this.$dom.find('.thumbnail').attr('src', imageUrl)
				))
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
