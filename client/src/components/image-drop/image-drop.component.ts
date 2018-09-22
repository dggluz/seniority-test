import { FileButtonComponent } from '../file-button/file-button.component';
import { Component } from '../component';

declare var require: <T = string>(path: string) => T;

require('./image-drop.component.less');

export class ImageDropComponent extends Component {
	constructor () {
		super(require('./image-drop.component.html'));
	}

	protected _setHandlers () {
		const $dropArea = this.$dom.find('.new-item-drop-image');
		resetFileDropArea($dropArea);
		this.$dom
			.on('drag dragstart dragend dragover dragenter dragleave drop', e => {
				e.preventDefault();
				e.stopPropagation();
			})
			.on('dragover dragenter', _ => setDraggingStylesOnFileDropArea($dropArea))
			.on('dragleave dragend drop', _ => resetFileDropArea($dropArea))
			.on('drop', e => {
				console.log(e);
				console.log('file dropped!');
			})
		;

		new FileButtonComponent().appendTo(this.$dom.find('.file-button-wrapper'));

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
