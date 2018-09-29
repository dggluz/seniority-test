import { Task } from '@ts-task/task';

export class XHRError extends Error {
	XHRError = 'XHRError';
}

/**
 * Performs an XHR request, returning a Task with its result.
 * @param options
 */
export const xhrTask = (options: JQuery.AjaxSettings) =>
	new Task<any, XHRError>((resolve, reject) => {
		$.ajax({
			...options,
			error: (_jqXHT, _textStatus, err) => reject(new XHRError(err)),
			success: resolve
		});
	});
;
