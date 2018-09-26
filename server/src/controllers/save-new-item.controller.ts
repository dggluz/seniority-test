import { Task } from '@ts-task/task';
import { createEndpoint } from '../server-utils/create-endpoint';
import { checkBody } from '../middlewares/check-body.middleware';
import { strictObjOf, str } from 'parmenides';
import { checkFiles, FileData } from '../middlewares/check-files.middleware';
import { configs } from '../configs';
import { caseError, isInstanceOf } from '@ts-task/utils';
import { asUnknownError } from '@ts-task/task/dist/lib/src/operators';
import { FsError, SyntaxJSONError, InvalidJSONError } from '../fs-utils';
import { rename } from 'fs';
import { generate } from 'shortid';
import { BadRequestError } from '../http-errors';
import { resolve } from 'path';

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
		// TODO: validate image (size)
		// TODO: validate description

		.chain(req => saveImageAsStatic(req.files.image))

		// TODO: save data
		.map(imageName => ({
			ok: true,
			image: imageName
		}))
	.catch(caseError(isInstanceOf(FileExtensionError), err => Task.reject(new BadRequestError(err))))
	.catch(
		caseError(
			isInstanceOf(
				FsError,
				SyntaxJSONError,
				InvalidJSONError
			),
			err => asUnknownError(err)
		)
	)
);

export class FileExtensionError extends Error {
	FileExtensionError = 'FileExtensionError';

	constructor (fileName: string) {
		super(`Could not determine file extension of file "${fileName}"`);
	}
}

const saveImageAsStatic = (imageFile: FileData) =>
	Task.all([
		Task
			.resolve(/\.([a-z]+)$/i.exec(imageFile.name))
			.chain(fileExtensionMatches => {
				if (!fileExtensionMatches || !fileExtensionMatches[1]) {
					return Task.reject(new FileExtensionError(imageFile.name));
				}
				return Task.resolve(fileExtensionMatches[1]);
			})
			.map(fileExtension => `${generate()}.${fileExtension}`),
		configs
	])
		.chain(([newFileName, configs]) =>
			moveToImagesFolder(
				imageFile.path,
				resolve(
					process.cwd(),
					`./${configs.static.namespace}/images/`,
					newFileName
				)
			)
				.map(_ => newFileName)
		)
;


const moveToImagesFolder = (originalPath: string, newImageName: string) =>
	new Task<void, FsError>((resolve, reject) => {
		rename(originalPath, newImageName, err => {
			if (err) {
				reject(new FsError(err));
			}
			else {
				resolve(undefined);
			}
		});
	})
;
