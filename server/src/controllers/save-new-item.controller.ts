import { Task } from '@ts-task/task';
import { createEndpoint } from '../server-utils/create-endpoint';
import { checkBody } from '../middlewares/check-body.middleware';
import { strictObjOf, str } from 'parmenides';
import { checkFiles } from '../middlewares/check-files.middleware';
import { caseError, isInstanceOf } from '@ts-task/utils';
import { asUnknownError } from '@ts-task/task/dist/lib/src/operators';
import { FsError, SyntaxJSONError, InvalidJSONError } from '../fs-utils';
import { BadRequestError } from '../http-errors';
import { saveImageAsStatic, FileExtensionError } from '../utils/save-image-as-static';
import { insertOneDocument, MongoDocument, isMongoError } from '../mongo-utils';
import { rejectIf } from '../utils/reject-if';
import * as sizeOf from 'image-size';
import { tapChain } from '../utils/tap-chain';

class ImageSizeError extends Error {
	ImageSizeError = 'ImageSizeError';

	constructor (public originalError: Error) {
		super(originalError.message);
	}
}

const getImageSize = (imagePath: string) =>
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

class InvalidImageDimensions extends Error {
	InvalidImageDimensions = 'InvalidImageDimensions';

	constructor (expectedHeight: number, expectedWith: number) {
		super(`Wrong image dimensions. Expected image to be ${expectedWith}x${expectedHeight}`);
	}
}

interface MongoItem extends MongoDocument {
	description: string;
	image: string;
}

const saveItem = insertOneDocument<MongoItem>('items');

const validateImageSize = (imagePath: string) => {
	const expectedHeight = 320;
	const expectedWidth = 320;

	return getImageSize(imagePath)
		.chain(rejectIf(
			dimensions =>
				dimensions.height !== expectedHeight || dimensions.width !== expectedWidth,
			new InvalidImageDimensions(expectedHeight, expectedWidth)
		));
};

/**
 * Endpoint that just response with a dummy object. Useful for checking if the server is alive.
 */
export const saveNewItemCtrl = createEndpoint(req =>
	Task
		.resolve(req)
		.chain(checkBody(strictObjOf({
			description: str
		})))
		.chain(checkFiles(['image']))

		// validate description
		.chain(rejectIf(
			req => !/.{1,300}/.test(req.body.description),
			new BadRequestError(new Error('Description should be non-empty and shorter than 300 characters'))
		))

		// validate image (size)
		.chain(tapChain(req => validateImageSize(req.files.image.path)))

		.chain(req =>
			// Save item to DB
			saveImageAsStatic(req.files.image)
				.chain(imageName => saveItem({
					description: req.body.description,
					image: imageName
				}))
		)
		.map(item => ({
			ok: true,
			item: item
		}))
		.catch(caseError(
			isInstanceOf(FileExtensionError, InvalidImageDimensions, ImageSizeError),
			err => Task.reject(new BadRequestError(err))
		))
		.catch(
			caseError(
				isInstanceOf(
					FsError,
					SyntaxJSONError,
					InvalidJSONError,
				),
				err => asUnknownError(err)
			)
		)
		.catch(
			caseError(
				isMongoError,
				err => asUnknownError(err)
			)
		)
	)
;
