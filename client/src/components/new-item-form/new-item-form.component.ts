import { Component } from '../component';
import { itemsStore } from '../../model/model';
import { Item } from '../../model/item';
import { readFileAsDataUrl } from '../../utils/read-file-as-data-url';
import { NewItemFormFirstStepComponent } from './first-step/new-item-form-first-step.component';
import { NewItemFormSecondStepComponent } from './second-step/new-items-form-second-step.component';

require('./new-item-form.component.less');

export class NewItemFormComponent extends Component {
	private _firstStep: NewItemFormFirstStepComponent;
	private _secondStep: NewItemFormSecondStepComponent;

	constructor () {
		super(require('./new-item-form.component.html'));

		this._firstStep = new NewItemFormFirstStepComponent(this)
			.appendTo(this.$dom.find('.first-step-wrapper'))
		;
		this._secondStep = new NewItemFormSecondStepComponent(this)
			.appendTo(this.$dom.find('.second-step-wrapper'))
		;

		this._showFirstStep();
		this._firstStep;
	}

	completeFirstStep (imageFile: File) {
		// TODO: validate dimensions
		readFileAsDataUrl(imageFile)
			.fork(_ => {
				// TODO: handle error.
			}, image => {
				this._showSecondStep(image);
			})
		;
		return this;
	}

	completeSecondStep (description: string) {
		Item.create(
			description,
			this._firstStep.getImageFile()
		).fork(_err => {
			// TODO: handle errors
		}, item => {
			itemsStore.addItem(item);
			this.restart();
		});
	}

	restart () {
		this._firstStep.restart();
		this._secondStep.restart();
		this._showFirstStep();
		return this;
	}

	private _showFirstStep () {
		this.$dom.find('.steps-wrapper').removeClass('show-second');
		return this;
	}
	
	private _showSecondStep (imageUrl: string) {
		this._secondStep.init(imageUrl);
		this.$dom.find('.steps-wrapper').addClass('show-second');
		return this;
	}
}
