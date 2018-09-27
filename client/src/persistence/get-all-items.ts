import { xhrTask } from '../utils/xhr-task';
import { apiDomain } from './api-domain';
import { arrOf } from 'parmenides';
import { validateServerResponse } from './validate-server-response';
import { itemContract } from './item-contract';


const getAllItemsContract = arrOf(itemContract);

export const getAllItems = () =>
	xhrTask({
		url: `${apiDomain}/items`,
		method: 'GET'
	})
		.chain(validateServerResponse(getAllItemsContract))
;
