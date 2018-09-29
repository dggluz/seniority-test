import { isImageFile } from './is-image-file';
import { getFile } from './get-file';
import { error } from 'toastr';

/**
 * Tries to get a file from a pretended image file.
 * Shows an error with a toastr label if it fails.
 * @param files
 */
export const validateOrReportSingleImageFile = (files: (File | DataTransferItem)[] | FileList) => {
	if (files.length !== 1) {
		error('Can not procese multiple files. Please select only one image.');
		return null;
	}

	if (!isImageFile(files[0])) {
		error('The file is not an image. Please, select an image.');
		return null;
	}

	return getFile(files[0]);
};
