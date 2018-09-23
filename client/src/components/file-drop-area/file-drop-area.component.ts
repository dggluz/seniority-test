import { Component } from '../component';

declare var require: <T = string>(path: string) => T;

require('./file-drop-area.component.less');

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
