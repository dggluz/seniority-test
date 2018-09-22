import { createServer } from './server-utils/create-server';
import { pingCtrl } from './controllers/ping.controller';

createServer()
	.fork(console.log, server => {
		server.get('/ping', pingCtrl);
	})
;
