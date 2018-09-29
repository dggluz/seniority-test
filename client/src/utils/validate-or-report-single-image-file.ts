import { isImageFile } from './is-image-file';
import { getFile } from './get-file';
import { error } from 'toastr';

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
