import { generate } from 'shortid';
import { Component } from '../component';

export interface TextboxComponentOptions {
	label?: string;
	placeholder?: string;
	description?: string;
	value?: string;
	required?: boolean;
	maxLength?: number;
	type?: InputTypes;
}

export type InputTypes = 'text' | 'email' | 'search' | 'password' | 'tel' | 'url';

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
			.setRequired(!!options.required)
			.setMaxLength(options.maxLength)
			.setType(options.type)
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

	setRequired (required: boolean) {
		this.$getInput().get(0).required = required;
		return this;
	}

	setMaxLength (maxLength?: number) {
		this.$getInput().attr('maxlength', typeof maxLength === 'number' ? maxLength : -1);
		return this;
	}

	setType (type: InputTypes = 'text') {
		this.$getInput().attr('type', type);
		return this;
	}

	private $getInput () {
		return this.$dom.find('input') as JQuery<HTMLInputElement>;
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
