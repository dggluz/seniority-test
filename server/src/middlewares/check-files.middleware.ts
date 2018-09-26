import { overwrite, taskValidation } from '../utils';
import { BadRequestError } from '../http-errors';
import { RequestFileInterface } from 'restify';
import { objOf, str } from 'parmenides';
import { Task } from '@ts-task/task';

const isFile = objOf<FileData>({
	type: str,
	path: str,
	name: str
});

export type FileData = {
	type: string;
	path: string;
	name: string;
};

export const checkFiles = <R extends {
	files?: {
		[name: string]: RequestFileInterface;
	}
}, T extends string> (expectedFiles: T[]) =>
	(req: R) => {
		if (!req.files) {
			return Task.reject(new BadRequestError(new Error('Files expected')));
		}

		return taskValidation(
			objOf<{
				[name in T]: FileData;
			}>(
				expectedFiles.reduce(
					(contractObj, aFileName) => {
						contractObj[aFileName] = isFile;
						return contractObj;
					},
					{} as any
				)
			),
			err => new BadRequestError(err)
		)(req.files as any)
			.map(files => overwrite(req, {files}))
	}
;
