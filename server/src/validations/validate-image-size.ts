import { getImageSize } from '../utils/get-image-size';
import { rejectIf } from '../utils/reject-if';

export class InvalidImageDimensions extends Error {
	InvalidImageDimensions = 'InvalidImageDimensions';

	constructor (expectedHeight: number, expectedWith: number) {
		super(`Wrong image dimensions. Expected image to be ${expectedWith}x${expectedHeight}`);
	}
}

export const validateImageSize = (imagePath: string) => {
	const expectedHeight = 320;
	const expectedWidth = 320;

	return getImageSize(imagePath)
		.chain(rejectIf(
			dimensions =>
				dimensions.height !== expectedHeight || dimensions.width !== expectedWidth,
			new InvalidImageDimensions(expectedHeight, expectedWidth)
		));
};
