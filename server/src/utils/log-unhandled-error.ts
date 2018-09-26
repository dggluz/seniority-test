/**
 * Logs an error to the console
 * @param err 
 * @return undefined
 */
export const logUnhandledError = (err: Error) => {
	console.error('Unhandled error!', err);
};
