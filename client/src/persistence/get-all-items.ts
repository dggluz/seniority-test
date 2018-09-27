import { xhrTask } from '../utils/xhr-task';
import { apiDomain } from './api-domain';

export const getAllItems = () => xhrTask({
	url: `${apiDomain}/items`,
	method: 'GET'
});
