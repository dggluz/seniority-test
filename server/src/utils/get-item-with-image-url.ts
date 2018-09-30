import { MongoItem } from '../db/schemas/item.schema';
import { configs } from '../configs';

/**
 * Takes the image file's name and returns the URL where it is served (as a Task).
 * @param imageName
 */
const getImageUrl = (imageName: string) =>
	configs
		.map(({ assets }) => `./${assets.imagesDir}/${imageName}`)
;

/**
 * Takes an item and returns a Task to it with the image changed to the image's URL
 * (useful to send it to the client).
 * @param item
 */
export const getItemWithImageUrl = (item: MongoItem) =>
	getImageUrl(item.image)
		.map(imageUrl => ({
			...item,
			image: imageUrl
		}))
;
