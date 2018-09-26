import { Task } from '@ts-task/task';
import { createEndpoint } from '../server-utils/create-endpoint';
import { checkBody } from '../middlewares/check-body.middleware';
import { strictObjOf, str } from 'parmenides';
import { checkFiles } from '../middlewares/check-files.middleware';

/**
 * Endpoint that just response with a dummy object. Useful for checking if the server is alive.
 */
export const saveNewItemCtrl = createEndpoint(req =>
	Task
		.resolve(req)
		.chain(checkBody(strictObjOf({
			description: str
		})))
		.chain(checkFiles(['image']))
		// TODO: save data
		.map(_ => ({
			ok: true
		}))
	)
;
