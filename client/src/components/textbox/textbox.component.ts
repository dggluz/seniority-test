import { generate } from 'shortid';
import { Component } from '../component';

export class TextboxComponent extends Component {
	private _id = generate();

	constructor () {
		super(require('./textbox.component.html'));

		this._getInput()
			.attr({
				id: this._getId(),
				'aria-describedby': this._getAriaDescription()
			});
		this.$dom.find('small').attr('id', this._getAriaDescription());
		this.$dom.find('label').attr('for', this._getId());
	}

	getValue () {
		return this._getInput().val() as string;
	}

	setValue (value: string) {
		this._getInput().val(value);
		return this;
	}

	private _getInput () {
		return this.$dom.find('input');
	}

	private _getId () {
		return this._id;
	}

	private _getAriaDescription () {
		return `${this._getId()}-aria-description`;
	}
}
