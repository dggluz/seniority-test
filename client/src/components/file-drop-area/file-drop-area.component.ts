import { Component } from '../component';
import { FileSelector } from '../../utils/file-selector.mixin';
import { isImageFile } from '../../utils/is-image-file';
import { as } from '../../utils/as';
import { toArray } from '../../utils/to-array';
import { validateOrReportSingleImageFile } from '../../utils/validate-or-report-single-image-file';

require('./file-drop-area.component.less');

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

const asDragEvent = as(DragEvent);

export interface FileDropAreaComponentOptions {
	text?: string;
}

export class FileDropAreaComponent extends FileSelector(Component) {
	constructor (options: FileDropAreaComponentOptions) {
		super(require('./file-drop-area.component.html'));

		this.setText(options.text || 'Drop your file here');
	}

	setText (text: string) {
		this.$dom.find('.text').text(text);
		return this;
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
				const image = validateOrReportSingleImageFile(
					getFilesRepresentation(
						asDragEvent(e.originalEvent)
					)
				);

				if (image) {
					this.setFile(image);
					this._triggerFileCallbacks();
				}
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
