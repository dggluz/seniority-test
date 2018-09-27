import { Component } from '../component';
import { FileSelector } from '../../utils/file-selector.mixin';

require('./file-drop-area.component.less');

// TODO: different styles for invalid drags
export class FileDropAreaComponent extends FileSelector(Component) {
	constructor () {
		super(require('./file-drop-area.component.html'));
	}

	configureAcceptedType (_acceptedType: string) {
		// TODO: view if it's possible to accept only certain file types
		return this;
	}

	restart () {
		resetFileDropArea(this.$dom);
		return this;
	}

	protected _setHandlers () {
		resetFileDropArea(this.$dom);
		this.$dom
			.on('drag dragstart dragend dragover dragenter dragleave drop', e => {
				e.preventDefault();
				e.stopPropagation();
			})
			.on('dragover dragenter', _ => setDraggingStylesOnFileDropArea(this.$dom))
			.on('dragleave dragend drop', _ => resetFileDropArea(this.$dom))
			.on('drop', e => {
				console.log(e);

				// TODO: validate that what was dropped is a file
				// TODO: validate there's only one file
				// TODO: validate file permissions
				// TODO: validate file type
				// TODO: extra validations (like image size)
				// TODO: trigger event handlers

				console.log('file dropped!');
			})
		;

		return this;
	}
}

const resetFileDropArea = ($fileDropArea: JQuery<HTMLElement>) => {
	$fileDropArea
		.removeClass('border-primary text-primary')
		.addClass('border-secondary')
	;
};

const setDraggingStylesOnFileDropArea = ($fileDropArea: JQuery<HTMLElement>) => {
	$fileDropArea
		.addClass('border-primary text-primary')
		.removeClass('border-secondary')
	;
};
