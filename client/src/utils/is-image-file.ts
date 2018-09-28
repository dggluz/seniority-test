export const isImageFile = (file: File | DataTransferItem) =>
	/^image\/.+$/.test(file.type)
;
