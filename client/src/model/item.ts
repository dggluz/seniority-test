import { Task } from '@ts-task/task';
import { Observable } from '../utils/observable.mixin';
import { EmptySuperClass } from '../utils/empty-super-class';
import { itemsStore } from './model';
import { rejectIf } from '../utils/reject-if';
import { tap } from '../utils/tap';
import { ImageWrapper } from './image-wrapper/image-wrapper';
import { ImageWrapperFile } from './image-wrapper/image-wrapper-file';
import { ImageWrapperUrl } from './image-wrapper/image-wrapper-url';

export class ItemDescriptionError extends Error {
	ItemDescriptionError = 'ItemDescriptionError';

	constructor (public description: string) {
		super(`The description "${description}" is invalid (can not be empty and must not exceed 300 characters)`);
	}
}

export class NoItemImageError extends Error {
	NoItemImage = 'NoItemImage';

	constructor () {
		super('You must supply an image for the item');
	}
}

export class Item extends Observable<{
	description: string;
	image: string;
	delete: Item;
}>().from(EmptySuperClass) {
	private _image: ImageWrapper = null as any;
	private _description: string = '';

	static create (description: string, image: File | null) {
		return Task.resolve(new Item())
			.chain(item => item.setDescription(description))
			.chain(item => item.setImage(image))
		;
	}

	private constructor () {
		super();
	}
	
	setDescription (description: string) {
		return Task
			.resolve(this)
			.chain(rejectIf(_ => !/.{1,300}/.test(description), new ItemDescriptionError(description)))
			.map(tap(_ => {
				this._description = description;
				this._notifyObservers('description', this.getDescription());		
			}))
		;
	}

	getDescription () {
		return this._description;
	}

	setImage (image: string | File | null) {
		return Task
			.resolve(this)
			.chain(_ => {
				if (!image) {
					return Task.reject(new NoItemImageError());
				}
				
				if (typeof image === 'string') {
					this._image = new ImageWrapperUrl(image);
				}
				else {
					this._image = new ImageWrapperFile(image);
				}
				return Task.resolve(this)
			})
			.chain(_ =>
				this
					.getImageAsUrl()
					.map(imageUrl => this._notifyObservers('image', imageUrl))
			)
			.map(_ => this)
		;
	}

	getImageAsUrl () {
		return this._image.getAsUrl();
	}

	getImageAsFile () {
		return this._image.getAsFile();
	}

	delete() {
		itemsStore.removeItem(this);
		this._notifyObservers('delete', this);
		return this;
	}
}
