import { createServer } from './server-utils/create-server';
import { pingCtrl } from './controllers/ping.controller';
import { saveNewItemCtrl } from './controllers/save-new-item.controller';
import { configs } from './configs';
import { Task } from '@ts-task/task';
import { plugins } from 'restify';
import { resolve } from 'path';
import { getItemsCtrl } from './controllers/get-items.controller';
import { deleteItemCtrl } from './controllers/delete-item.controller';
import { updateItemDescriptionCtrl } from './controllers/update-item-description.controller';
import { updateItemImageCtrl } from './controllers/update-item-image.controller';
import { updateItemOrderCtrl } from './controllers/update-item-order.controller';

Task.all([
	createServer(),
	configs
])
	.fork(
		err => {
			console.error(err);
			process.exit(1);
		}, ([server, configs]) => {
			// Redirect "/" to static
			server.get('/', function (_req, res, next) {
				res.redirect('./static/', next);
			});

			// Setting up API routes
			server.get('/api/ping', pingCtrl);
			server.post('/api/items', saveNewItemCtrl);
			server.get('/api/items', getItemsCtrl);
			server.del('/api/items/:itemId', deleteItemCtrl);
			server.patch('/api/items/:itemId/description', updateItemDescriptionCtrl);
			server.patch('/api/items/:itemId/order', updateItemOrderCtrl);
			server.patch('/api/items/:itemId/image', updateItemImageCtrl);

			// Setting up static server
			server.get(`/${configs.assets.namespace}/*`, plugins.serveStatic({
				directory: resolve(process.cwd(), `./${configs.assets.namespace}/../`),
				default: 'index.html'
			}));
		}
	)
;
