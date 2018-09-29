import { Task } from '@ts-task/task';
import { rejectIf } from './reject-if';

export class InvalidImageDimensionsError extends Error {
	constructor (expectedDimensions: { height: number; width: number; }) {
		super(`Invalid image dimensions. Expected to be ${expectedDimensions.height}x${expectedDimensions.width}`);
	}
}

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
