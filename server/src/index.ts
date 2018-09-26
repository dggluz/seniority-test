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
			server.get('/api/ping', pingCtrl);
			server.post('/api/item', saveNewItemCtrl);

			const staticDir = resolve(process.cwd(), `./${configs.static.namespace}/../`);
			console.log('static dir', staticDir);
			server.get(`/${configs.static.namespace}/*`, plugins.serveStatic({
				directory: staticDir,
				default: 'index.html'
			}));
		}
	)
;
