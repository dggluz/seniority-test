import { Observable } from '../utils/observable.mixin';
import { EmptySuperClass } from '../utils/empty-super-class';

export class Item extends Observable<{
	description: string;
}>().from(EmptySuperClass) {
	private _image: File;
	private _description: string = '';

	constructor (description: string, image: File | null) {
		super();

		if (!image) {
			// TODO: do it the Task way?
			throw new Error('You must supply an image for the item!');
		}

		this.setDescription(description);
		
		this._image = image;
	}
	
	setDescription (description: string) {
		if (!/.{1,300}/.test(description)) {
			// TODO: do it the Task way?
			throw new Error('The description is invalid');
		}
		
		this._description = description;

		this._notifyObservers('description', this.getDescription());

		return this;
	}

	getDescription () {
		return this._description;
	}

	getImage () {
		return this._image;
	}
}
