import { updateOneDocument } from './mongo-utils';
import { MongoItem } from './schemas/item.schema';

export const updateItem = updateOneDocument<MongoItem>('items');
