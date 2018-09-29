import { initPersistence } from './persistence/persistence';
import { MainPageComponent } from './components/main-page/main.page.component';
import { itemsStore } from './model/model';
import { options } from 'toastr';

const mainPage = new MainPageComponent();

initPersistence();

itemsStore.subscribe('init', () => {
	mainPage.appendTo($('#app').empty());
});

// Configure toastr
options.closeButton = true;
options.positionClass = 'toast-bottom-right';
