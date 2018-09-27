import { xhrTask } from '../utils/xhr-task';
import { apiDomain } from './api-domain';
import { arrOf, strictObjOf, str } from 'parmenides';
import { validateServerResponse } from './validate-server-response';

export interface ItemData {
	_id: string;
	description: string;
	image: string;
}

const getAllItemsContract = arrOf<ItemData>(
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