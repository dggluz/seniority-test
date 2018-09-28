import { Component } from '../component';
import { FileSelector } from '../../utils/file-selector.mixin';

require('./file-drop-area.component.less');

const toArray = <T> (arrayLike: ArrayLike<T>): T[] =>
	[].slice.call(arrayLike)
;

type FileRepresentation = File | DataTransferItem;

const getFilesRepresentation = (e: DragEvent): FileRepresentation[] => {
	if (e.dataTransfer.items) {
		return toArray(e.dataTransfer.items)
			.filter(item => item.kind === 'file')
		;
	}
	return toArray(e.dataTransfer.files);
};

const hasSingleImageFile = (files: FileRepresentation[]) =>
	files.length === 1 && isImageFile(files[0])
;

const isImageFile = (file: FileRepresentation) =>
	/^image\/.+$/.test(file.type)
;

const getFile = (fileRepresentation: File | DataTransferItem) =>
	fileRepresentation instanceof File ?
		fileRepresentation :
		(fileRepresentation.getAsFile())
;

const asDragEvent = (event: Event) => {
	if (event instanceof DragEvent) {
		return event;
	}
	throw new TypeError(`Expected event "${event}" to be a DragEvent`);
}

export class FileDropAreaComponent extends FileSelector(Component) {
	constructor () {
		super(require('./file-drop-area.component.html'));
	}

	restart () {
		this._resetFileDropArea();
		return this;
	}

	protected _setHandlers () {
		this._resetFileDropArea();
		this.$dom
			.on('drag dragstart dragend dragover dragenter dragleave drop', e => {
				e.preventDefault();
				e.stopPropagation();
			})
			.on('dragover dragenter', e =>
				this._setDraggingStylesOnFileDropArea(asDragEvent(e.originalEvent))
			)
			.on('dragleave dragend drop', _ => this._resetFileDropArea())
			.on('drop', e => {
				const files = getFilesRepresentation(asDragEvent(e.originalEvent));

				if (files.length !== 1) {
					console.error('Drop only one file');
					return;
				}

				if (!isImageFile(files[0])) {
					console.error('Image files accepted only');
					return;
				}

				// TODO: extra validations (like image size)

				this.setFile(getFile(files[0]));
				this._triggerFileCallbacks();
			})
		;

		return this;
	}

	private _resetFileDropArea () {
		this.$dom
			.removeClass('border-primary text-primary border-danger text-danger')
			.addClass('border-secondary')
		;
	}

	private _setDraggingStylesOnFileDropArea (event: DragEvent) {
		this.$dom
			.addClass(
				hasSingleImageFile(getFilesRepresentation(event)) ?
					'border-primary text-primary' :
					'border-danger text-danger'
			)
			.removeClass('border-secondary')
		;
	}
}