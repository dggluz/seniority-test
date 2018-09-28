import { Component } from '../component';
import { FileSelector } from '../../utils/file-selector.mixin';
import { isImageFile } from '../../utils/is-image-file';
import { as } from '../../utils/as';

require('./file-button.component.less');

export class FileButtonComponent extends FileSelector(Component) {
	constructor () {
		super(require('./file-button.component.html'));
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
				e.preventDefault();
				const files = as(HTMLInputElement)(this._getInputFile().get(0)).files;
				if (files) {
					// TODO: report error
					if (files.length !== 1) {
						console.error('Drop only one file');
						return;
					}
	
					// TODO: report error
					if (!isImageFile(files[0])) {
						console.error('Image files accepted only');
						return;
					}
	
					this.setFile(files[0]);
					this._triggerFileCallbacks();
				}
			});
		return this;
	}
}
