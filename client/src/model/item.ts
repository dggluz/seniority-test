import { Task } from '@ts-task/task';
import { Observable } from '../utils/observable.mixin';
import { EmptySuperClass } from '../utils/empty-super-class';
import { itemsStore } from './model';
import { rejectIf } from '../utils/reject-if';
import { tap } from '../utils/tap';
import { ImageWrapper } from './image-wrapper/image-wrapper';
import { ImageWrapperFile } from './image-wrapper/image-wrapper-file';
import { ImageWrapperUrl } from './image-wrapper/image-wrapper-url';
import { validateImageSize } from '../utils/validate-image-size';
import { tapChain } from '../utils/tap-chain';

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

export class ItemWithoutIdError extends Error {
	ItemWithoutIdError = 'ItemWithoutIdError';
}

const EXPECTED_IMAGE_HEIGHT = 320;
const EXPECTED_IMAGE_WIDTH = 320;

/**
 * @class
 * Item model
 */
export class Item extends Observable<{
	description: string;
	order: number;
	image: string;
	delete: Item;
}>().from(EmptySuperClass) {
	private _image: ImageWrapper = null as any;
	private _description: string = '';
	private _order: number = 0;
	private _id: Task<string, ItemWithoutIdError> = Task.reject(new ItemWithoutIdError());

	static create (description: string, image: File | null) {
		return Task.resolve(new Item())
			.chain(item => item.setDescription(description))
			.chain(item => item.setImage(image))
		;
	}

	private constructor () {
		super();
	}
	
	setId (id: string) {
		this._id = Task.resolve(id);
		return this;
	}

	getId () {
		return this._id;
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

	/**
	 * Sets the image, delegating the image read on an Strategy depending on image's type
	 * @param image 
	 */
	setImage (image: string | File | null) {
		return Task
			.resolve(this)
			.chain(_ => {
				if (!image) {
					return Task.reject(new NoItemImageError());
				}
				
				if (typeof image === 'string') {
					this._image = new ImageWrapperUrl(image);
					return this.getImageAsUrl();
				}

				const imageWrapperFile = new ImageWrapperFile(image);

				return imageWrapperFile
					.getAsUrl()
					// Validate image size
					.chain(tapChain(validateImageSize({
						height: EXPECTED_IMAGE_HEIGHT,
						width: EXPECTED_IMAGE_WIDTH
					})))
					// Once, validated set the image
					.map(tap(_ => this._image = imageWrapperFile))
			})
			.map(tap(imageUrl => this._notifyObservers('image', imageUrl)))
			.map(_ => this)
		;
	}

	getImageAsUrl () {
		return this._image.getAsUrl();
	}

	getImageAsFile () {
		return this._image.getAsFile();
	}

	setOrder (order: number) {
		this._order = order;
		this._notifyObservers('order', this.getOrder());
		return this;
	}

	getOrder () {
		return this._order;
	}

	delete() {
		itemsStore.removeItem(this);
		this._notifyObservers('delete', this);
		return this;
	}
}
