import { deleteDocument } from './mongo-utils';
import { MongoItem } from './schemas/item.schema';

export const deleteItem = deleteDocument<MongoItem>('items');
