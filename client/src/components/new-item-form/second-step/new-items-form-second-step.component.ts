import { Component } from '../../component';
import { TextboxComponent } from '../../textbox/textbox.component';
import { NewItemFormComponent } from '../new-item-form.component';

require('./new-item-form-second-step.component.less');

export class NewItemFormSecondStepComponent extends Component {
	private _description: TextboxComponent;

	constructor (private _wizard: NewItemFormComponent) {
		super(require('./new-item-form-second-step.component.html'));

		this._description = new TextboxComponent({
			placeholder: 'Description...',
			description: 'The description for your item',
			label: 'Description',
			maxLength: 300,
			required: true
		})
			.appendTo(this.$dom.find('.description-wrapper'))
		;
	}
	
	init (imageUrl: string) {
		this.$dom.find('.image-preview img').attr('src', imageUrl)
		this._description.focus();
		return this;
	}
	
	restart () {
		this._description.setValue('');
		this.$dom.find('.image-preview img').attr('src', '');
		return this;
	}

	protected _setHandlers () {
		this.$dom.find('form')
			.submit(e => {
				e.preventDefault();
				this._wizard.completeSecondStep(this._description.getValue());
			})
			.on('reset', e => {
				e.preventDefault();
				this._wizard.restart();
			})
		;
		return this;
	}
}
