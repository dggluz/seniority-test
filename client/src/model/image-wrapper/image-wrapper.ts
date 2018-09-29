import { Task } from '@ts-task/task';
import { ImageUrlToFileError } from './image-url-to-file.error';
import { FileReadError } from '../../utils/read-file-as-data-url';

export interface ImageWrapper {
	getAsUrl: () => Task<string, FileReadError>
	getAsFile: () => Task<File, ImageUrlToFileError>
}
