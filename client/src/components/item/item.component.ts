import { Component } from '../component';
import { Item } from '../../model/item';

require('./item.component.less');

export class ItemComponent extends Component {
	private _model: Item;

	constructor (model: Item) {
		super(require('./item.component.html'));

		this._model = model
			.subscribe('description', description => {
				this._updateDescription(description);
			})
			.subscribe('delete', _ => {
				this._destroy();
			})
		;

		this
			._updateDescription(this.getModel().getDescription())
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

	private _updateDescription(description: string) {
		this.$dom.find('.description').text(description);
		return this;
	}

	private _destroy () {
		this.$dom.remove();
		return this;
	}
}
