const $fileDropArea = $('#new-item-drop-image')
	.on('drag dragstart dragend dragover dragenter dragleave drop', e => {
		e.preventDefault();
		e.stopPropagation();
	})
	.on('dragover dragenter', () => {
		$fileDropArea
			.addClass('border-primary text-primary')
			.removeClass('border-secondary');
	})
	.on('dragleave dragend drop', () => {
		$fileDropArea
			.removeClass('border-primary text-primary')
			.addClass('border-secondary')
		;
	})
	.on('drop', e => {
		console.log(e);
		console.log('file dropped!');
	})
;

