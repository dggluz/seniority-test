import { MongoDocument } from '../mongo-utils';

export interface MongoItem extends MongoDocument {
	description: string;
	image: string;
	order: number;
}
