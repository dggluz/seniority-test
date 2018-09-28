import { Component } from '../../component';
import { ImageFileLoaderComponent } from '../../image-file-loader/image-file-loader.component';
import { NewItemFormComponent } from '../new-item-form.component';

export class NewItemFormFirstStepComponent extends Component {
	private _imageFileSelector: ImageFileLoaderComponent;

	constructor (_wizard: NewItemFormComponent) {
		super(require('./new-item-form-first-step.component.html'));

		this._imageFileSelector = new ImageFileLoaderComponent()
			.onNewFile(file => {
				_wizard.completeFirstStep(file);
			})
			.appendTo(this.$dom.find('.image-file-selector-wrapper'))
		;
	}

	getImageFile () {
		return this._imageFileSelector.getImageFile();
	}

	restart () {
		this._imageFileSelector.restart();
		return this;
	}
}
