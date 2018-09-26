import { MongoItem } from './schemas/item.schema';
import { insertOneDocument } from './mongo-utils';

export const saveNewItem = insertOneDocument<MongoItem>('items');
