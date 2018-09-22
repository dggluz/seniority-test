import { createServer } from './server-utils/create-server';
import { pingCtrl } from './controllers/ping.controller';

createServer()
	.fork(
		err => {
			console.error(err);
			process.exit(1);
		}, server => {
			server.get('/ping', pingCtrl);
		}
	)
;
