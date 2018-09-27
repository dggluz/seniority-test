import { MongoItem } from '../db/schemas/item.schema';
import { configs } from '../configs';

const getImageUrl = (imageName: string) =>
	configs
		.map(({ assets }) => `./${assets.imagesDir}/${imageName}`)
;

export const getItemWithImageUrl = (item: MongoItem) =>
	getImageUrl(item.image)
		.map(imageUrl => ({
			...item,
			image: imageUrl
		}))
;
