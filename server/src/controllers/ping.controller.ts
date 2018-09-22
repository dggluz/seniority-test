import { Task } from '@ts-task/task';
import { createEndpoint } from '../server-utils/create-endpoint';

/**
 * Endpoint that just response with a dummy object. Useful for checking if the server is alive.
 */
export const pingCtrl = createEndpoint(_ =>
	Task
		.resolve({
			connection: true
		})
	)
;
