import { Component } from '../component';
import { Item } from '../../model/item';

export class ItemComponent extends Component {
	private _model: Item;

	constructor (model: Item) {
		super(require('./item.component.html'));

		this._model = model
			.subscribe('description', description => {
				this._updateDescription(description);
			});

		this
			._updateDescription(this.getModel().getDescription())
		;
	}

	private getModel () {
		return this._model;
	}

	private _updateDescription(description: string) {
		this.$dom.find('.description').text(description);
		return this;
	}
}
