declare var require: {
	<T = string>(path: string): T;
	(paths: string[], callback: (...modules: any[]) => void): void;
	ensure: (
		paths: string[],
		callback: (require: <T = string>(path: string) => T) => void
	) => void;
};

require('./image-drop.component.css');
const html = require('./image-drop.component.html');

export class ImageDropComponent {
	private $component: JQuery<HTMLElement>;

	constructor () {
		this.$component = $(html);
		const $dropArea = this.$component.find('.new-item-drop-image');
		resetFileDropArea($dropArea);
		this.$component
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
	}

	public appendTo ($wrapper: JQuery<HTMLElement>) {
		this.$component.appendTo($wrapper);
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
