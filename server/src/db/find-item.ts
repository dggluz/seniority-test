import { findOneDocument } from './mongo-utils';
import { MongoItem } from './schemas/item.schema';

export const findItem = findOneDocument<MongoItem>('items');
