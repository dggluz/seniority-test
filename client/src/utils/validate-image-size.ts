import { Task } from '@ts-task/task';
import { rejectIf } from './reject-if';

export class InvalidImageDimensionsError extends Error {
	constructor (expectedDimensions: { height: number; width: number; }) {
		super(`Invalid image dimensions. Expected to be ${expectedDimensions.height}x${expectedDimensions.width}`);
	}
}

/**
 * Takes the expected dimensions of the image and returns function that takes a base64 image
 * and return a Task that's rejected if the dimensions doesn't match.
 * @param expectedDimensions
 */
export const validateImageSize = (expectedDimensions: { height: number; width: number; }) =>
	(imageUrl: string) =>
		getImageSize(imageUrl)
			.chain(rejectIf(
				actualDimensions =>
					actualDimensions.height !== expectedDimensions.height ||
					actualDimensions.width !== expectedDimensions.width,
				new InvalidImageDimensionsError(expectedDimensions)
			))
;

/**
 * Takes a base64 image and returns a Task to its size.
 * @param imageUrl
 */
const getImageSize = (imageUrl: string) =>
	new Task<{ height: number; width: number; }, ErrorEvent>((resolve, reject) => {
		const img = new Image();
		img.onerror = reject;
		img.onload = _ =>
			resolve({
				height: img.height,
				width: img.width
			})
		;
		img.src = imageUrl;
	})
;
