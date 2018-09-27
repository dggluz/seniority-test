import { ImageWrapper } from './image-wrapper';
import { readFileAsDataUrl } from '../../utils/read-file-as-data-url';
import { Task } from '@ts-task/task';

export class ImageWrapperFile implements ImageWrapper {
	constructor (private _imageFile: File) {
	}

	getAsUrl () {
		return readFileAsDataUrl(this._getImage());
	}

	getAsFile () {
		return Task.resolve(this._getImage());
	}

	private _getImage () {
		return this._imageFile;
	}
}
