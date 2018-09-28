/**
 * Gets a File from a File or a DataTransferItem
 * @param fileRepresentation a File or DataTransferItem with "kind" file
 */
export const getFile = (fileRepresentation: File | DataTransferItem) =>
	fileRepresentation instanceof File ?
		fileRepresentation :
		(fileRepresentation.getAsFile())
;
