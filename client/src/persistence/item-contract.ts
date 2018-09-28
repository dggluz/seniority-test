import { strictObjOf, str, num } from 'parmenides';

export interface ItemData {
	_id: string;
	description: string;
	image: string;
	order: number;
}

export const itemContract = strictObjOf<ItemData>({
	_id: str,
	description: str,
	image: str,
	order: num
});