import { MongoDocument } from '../mongo-utils';

/**
 * Item structure as saved on database
 */
export interface MongoItem extends MongoDocument {
	description: string;
	image: string;
	order: number;
}
