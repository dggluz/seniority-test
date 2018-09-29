/**
 * Checks if the input is or represents an image file, based on its mime type.
 * @param file 
 */
export const isImageFile = (file: File | DataTransferItem) =>
	/^image\/.+$/.test(file.type)
;
