import { Task } from '@ts-task/task';
import { ImageUrlToFileError } from './image-url-to-file.error';
import { FileReadError } from '../../utils/read-file-as-data-url';

export interface ImageWrapper {
	// TODO: improve error handling
	getAsUrl: () => Task<string, FileReadError>
	// TODO: improve error handling
	getAsFile: () => Task<File, ImageUrlToFileError>
}
