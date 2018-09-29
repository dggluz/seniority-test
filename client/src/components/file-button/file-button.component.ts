import { Component } from '../component';
import { FileSelector } from '../../utils/file-selector.mixin';
import { as } from '../../utils/as';
import { validateOrReportSingleImageFile } from '../../utils/validate-or-report-single-image-file';

require('./file-button.component.less');

export interface FileButtonComponentOptions {
	text?: string;
}

export class FileButtonComponent extends FileSelector(Component) {
	constructor (options: FileButtonComponentOptions) {
		super(require('./file-button.component.html'));

		this
			.setText(options.text || 'Select file');
	}
	
	restart () {
		this._getInputFile().val('');
		return this;
	}
	
	setText (text: string) {
		this.$dom.find('.text').text(text);
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
				const image = files && validateOrReportSingleImageFile(files);

				if (image) {
					this.setFile(image);
					this._triggerFileCallbacks();
				}
			});
		return this;
	}
}
