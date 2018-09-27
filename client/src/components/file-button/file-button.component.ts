import { Component } from '../component';
import { getEventTargetProp } from '../../utils/get-event-target-prop';
import { FileSelector } from '../../utils/file-selector.mixin';

require('./file-button.component.less');

export class FileButtonComponent extends FileSelector(Component) {
	constructor () {
		super(require('./file-button.component.html'));
	}

	configureAcceptedType (acceptedType: string) {
		this._getInputFile().attr('accept', acceptedType);
		return this;
	}

	restart () {
		this._getInputFile().val('');
		return this;
	}

	private _getInputFile () {
		return this.$dom.find('input[type=file]');
	}

	protected _setHandlers () {
		this
			._getInputFile()
			.change(e => {
				const files = getEventTargetProp<FileList>(e.originalEvent, 'files');
				if (files) {
					// TODO: validate there's only one file
					// TODO: validate file permissions
					// TODO: validate file type
					// TODO: extra validations (like image size)
					// TODO: trigger event handlers
					this.setFile(files[0]);
					this._triggerFileCallbacks();
				}
			});
		return this;
	}
}
