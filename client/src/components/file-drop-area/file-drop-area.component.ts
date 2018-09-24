import { Component } from '../component';

require('./file-drop-area.component.less');

// TODO: support specific mime types
// TODO: different styles for invalid drags
export class FileDropAreaComponent extends Component {
	constructor () {
		super(require('./file-drop-area.component.html'));
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
