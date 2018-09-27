import { xhrTask } from '../utils/xhr-task';
import { apiDomain } from './api-domain';
import { arrOf, strictObjOf, str } from 'parmenides';
import { validateServerResponse } from './validate-server-response';

const getAllItemsContract = arrOf(
	strictObjOf({
		_id: str,
		description: str,
		image: str
	})
);

export const getAllItems = () =>
	xhrTask({
		url: `${apiDomain}/items`,
		method: 'GET'
	})
		.chain(validateServerResponse(getAllItemsContract))
;
