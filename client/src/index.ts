import { initPersistence } from './persistence/persistence';
import { MainPageComponent } from './components/main-page/main.page.component';
import { itemsStore } from './model/model';

const mainPage = new MainPageComponent();

initPersistence();

itemsStore.subscribe('init', () => {
	mainPage.appendTo($('#app').empty());
});
