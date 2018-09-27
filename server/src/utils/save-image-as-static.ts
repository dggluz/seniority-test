import { Task } from '@ts-task/task';
import { generate } from 'shortid';
import { resolve } from 'path';
import { FileData } from '../middlewares/check-files.middleware';
import { configs } from '../configs';
import { moveFile } from '../fs-utils';

export class FileExtensionError extends Error {
	FileExtensionError = 'FileExtensionError';

	constructor (fileName: string) {
		super(`Could not determine file extension of file "${fileName}"`);
	}
}

export const saveImageAsStatic = (imageFile: FileData) =>
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
			moveFile(
				imageFile.path,
				resolve(
					process.cwd(),
					`./${configs.assets.namespace}/images/`,
					newFileName
				)
			)
				.map(_ => newFileName)
		)
;
