import { Task } from '@ts-task/task';
import { str } from 'parmenides';
import { ensure } from './ensure';

export class FileReadError extends Error {
	FileReadError = 'FileReadError';

	constructor (public originalError: ProgressEvent | string) {
		super(originalError.toString());
	}
}

export const readFileAsDataUrl = (file: File) =>
	new Task<string, FileReadError>((resolve, reject) => {
		var reader = new FileReader();

		reader.onload = _ => {
			const dataURLImage = ensure(str)(reader.result);
			if (dataURLImage) {
				resolve(dataURLImage);
			}
			else {
				reject(new FileReadError('Could not read file'));
			}
		};

		reader.onerror = e => reject(new FileReadError(e));
	
		reader.readAsDataURL(file);
	})
;
