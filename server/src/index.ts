import { createServer } from './server-utils/create-server';
import { pingCtrl } from './controllers/ping.controller';
import { saveNewItemCtrl } from './controllers/save-new-item.controller';

createServer()
	.fork(
		err => {
			console.error(err);
			process.exit(1);
		}, server => {
			server.get('/api/ping', pingCtrl);
			server.post('/api/item', saveNewItemCtrl);
		}
	)
;
