import { generate } from 'shortid';
import { Component } from '../component';

export interface TextboxComponentOptions {
	label?: string;
	placeholder?: string;
	description?: string;
	value?: string;
}

export class TextboxComponent extends Component {
	private _id = generate();

	constructor (options: TextboxComponentOptions) {
		super(require('./textbox.component.html'));

		this.$getInput()
			.attr({
				id: this._getId(),
				'aria-describedby': this._getAriaDescription()
			})
		;

		this
			.$getLongDescription()
			.attr({
				id: this._getAriaDescription()
			})
		;

		this
			.$getLabel()
			.attr({
				'for': this._getId()
			})
		;

		this
			.setPlaceholder(options.placeholder || '')
			.setLabel(options.label || '')
			.setDescription(options.description || '')
			.setValue(options.value || '')
		;
	}

	getValue () {
		return this.$getInput().val() as string;
	}

	setValue (value: string) {
		this.$getInput().val(value);
		return this;
	}

	setPlaceholder (placeholder: string) {
		this.$getInput().attr('placeholder', placeholder);
		return this;
	}

	setLabel (label: string) {
		this.$getLabel().text(label);
		return this;
	}

	setDescription (description: string) {
		this.$getLongDescription().text(description);
		return this;
	}

	private $getInput () {
		return this.$dom.find('input');
	}

	private $getLabel () {
		return this.$dom.find('label');
	}

	private $getLongDescription () {
		return this.$dom.find('small');
	}

	private _getId () {
		return this._id;
	}

	private _getAriaDescription () {
		return `${this._getId()}-aria-description`;
	}
}
