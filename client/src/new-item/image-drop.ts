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

export const init = () => {
	const $fileDropArea = $('#new-item-drop-image');
	resetFileDropArea($fileDropArea);

	$fileDropArea
		.on('drag dragstart dragend dragover dragenter dragleave drop', e => {
			e.preventDefault();
			e.stopPropagation();
		})
		.on('dragover dragenter', _ => setDraggingStylesOnFileDropArea($fileDropArea))
		.on('dragleave dragend drop', _ => resetFileDropArea($fileDropArea))
		.on('drop', e => {
			console.log(e);
			console.log('file dropped!');
		})
	;
};
