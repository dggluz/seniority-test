import { Observable } from '../utils/observable.mixin';
import { EmptySuperClass } from '../utils/empty-super-class';

export class Item extends Observable().from(EmptySuperClass) {
	private _image: File;
	constructor (image: File | null) {
		super();

		if (!image) {
			// TODO: do it the Task way?
			throw new Error('You must supply an image for the item!');
		}

		this._image = image;
	}

	getImage () {
		return this._image;
	}
}
