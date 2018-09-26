import { itemsStore } from '../model/model';
import { saveNewItem } from './save-new-item';

export const initPersistence = () => {
	itemsStore.subscribe('new-item', saveNewItem);
};
