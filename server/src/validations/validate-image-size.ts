import { getImageSize } from '../utils/get-image-size';
import { rejectIf } from '../utils/reject-if';
import { Task } from '@ts-task/task';
import { configs } from '../configs';

export class InvalidImageDimensions extends Error {
	InvalidImageDimensions = 'InvalidImageDimensions';

	constructor (expectedHeight: number, expectedWith: number) {
		super(`Wrong image dimensions. Expected image to be ${expectedWith}x${expectedHeight}`);
	}
}

export const validateImageSize = (imagePath: string) => {
	const expectedHeight = 320;
	const expectedWidth = 320;

	return Task.all([
		getImageSize(imagePath),
		configs
	])
		.chain(rejectIf(
			([actualDimensions, { imageSize }]) =>
				actualDimensions.height !== imageSize.height || actualDimensions.width !== imageSize.width,
			new InvalidImageDimensions(expectedHeight, expectedWidth)
		));
};
