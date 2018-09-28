import { isImageFile } from './is-image-file';
import { getFile } from './get-file';

export const validateOrReportSingleImageFile = (files: (File | DataTransferItem)[] | FileList) => {
	if (files.length !== 1) {
		console.error('Drop only one file');
		return null;
	}

	// TODO: report error
	if (!isImageFile(files[0])) {
		console.error('Image files accepted only');
		return null;
	}

	return getFile(files[0]);
};
