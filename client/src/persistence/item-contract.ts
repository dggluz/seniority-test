import { strictObjOf, str } from 'parmenides';

export interface ItemData {
	_id: string;
	description: string;
	image: string;
}

export const itemContract = strictObjOf<ItemData>({
	_id: str,
	description: str,
	image: str
});