import { Component } from '../component';
import { Item } from '../../model/item';

require('./item.component.less');

export class ItemComponent extends Component {
	private _model: Item;

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
		return this;
	}

	private getModel () {
		return this._model;
	}

	private _updateDescription() {
		this.$dom.find('.description').text(this.getModel().getDescription());
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
}
