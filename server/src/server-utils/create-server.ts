import { createServer as cs, plugins } from 'restify';
import { configs } from '../configs';
import { Task } from '@ts-task/task';
import { readAndValidateJSONFile } from '../fs-utils';
import { resolve } from 'path';
import { objOf, str } from 'parmenides';

/**
 * Task to the content of the package.json file, parsed, validated and shared.
 */
const packageJson = readAndValidateJSONFile(
	resolve(process.cwd(), 'package.json'),
	objOf({
		name: str,
		version: str
	})
);

/**
 * Creates a restify Server with basic configuration and taking part of its configuration
 * from the package.json and the configs.json files.
 * @return Server
*/
export const createServer = () =>
	Task
		.all([
			configs,
			packageJson
		])
		.map(([configs, {name, version}]) => {
			const server = cs({
				name,
				version
			});
		
			server.use(plugins.acceptParser(server.acceptable));
			server.use(plugins.queryParser());
			server.use(plugins.bodyParser());
			// CORS: accept all requests
			server.use((_req, res, next) => {
				res.header('Access-Control-Allow-Origin', '*');
				res.header('Access-Control-Allow-Headers', 'X-Requested-With');
				return next();
			});
		
			server.listen(configs.server.port, function () {
				console.log('%s listening at %s', server.name, server.url);
			});
		
			return server;
		})
;
