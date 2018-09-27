import { ImageWrapper } from './image-wrapper';
import { Task } from '@ts-task/task';
import { ImageUrlToFileError } from './image-url-to-file.error';

export class ImageWrapperUrl implements ImageWrapper {
	constructor (private _imageUrl: string) {
	}

	getAsFile () {
		return Task.reject(new ImageUrlToFileError());
	}

	getAsUrl () {
		return Task.resolve(this._getImage());
	}

	private _getImage () {
		return this._imageUrl;
	}
}
