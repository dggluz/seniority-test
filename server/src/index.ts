import { createServer } from './server-utils/create-server';
import { pingCtrl } from './controllers/ping.controller';
import { saveNewItemCtrl } from './controllers/save-new-item.controller';
import { configs } from './configs';
import { Task } from '@ts-task/task';
import { plugins } from 'restify';
import { resolve } from 'path';

Task.all([
	createServer(),
	configs
])
	.fork(
		err => {
			console.error(err);
			process.exit(1);
		}, ([server, configs]) => {
			// Setting up API routes
			server.get('/api/ping', pingCtrl);
			server.post('/api/items', saveNewItemCtrl);

			// Setting up static server
			server.get(`/${configs.static.namespace}/*`, plugins.serveStatic({
				directory: resolve(process.cwd(), `./${configs.static.namespace}/../`),
				default: 'index.html'
			}));
		}
	)
;
