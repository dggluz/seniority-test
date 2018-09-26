import { Task } from '@ts-task/task';
import * as sizeOf from 'image-size';

export class ImageSizeError extends Error {
	ImageSizeError = 'ImageSizeError';

	constructor (public originalError: Error) {
		super(originalError.message);
	}
}

export const getImageSize = (imagePath: string) =>
	new Task<{
		height: number;
		width: number;
	}, ImageSizeError>((resolve, reject) => {
		sizeOf(imagePath, (err, dimensions) => {
			if (err) {
				reject(new ImageSizeError(err));
			}
			else {
				resolve(dimensions);
			}
		});
	})
;