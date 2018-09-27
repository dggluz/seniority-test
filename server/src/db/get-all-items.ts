import { getAllDocuments } from './mongo-utils';
import { MongoItem } from './schemas/item.schema';

export const getAllItems = getAllDocuments<MongoItem>('items');
