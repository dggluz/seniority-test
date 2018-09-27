import { Component } from '../component';

export class TextboxComponent extends Component {
	constructor () {
		super(require('./textbox.component.html'));
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
}
