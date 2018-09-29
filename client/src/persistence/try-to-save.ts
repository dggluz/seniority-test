import { Task } from '@ts-task/task';
import { persistenceMonitor } from './persistence-monitor.instance';

/**
 * Calls the parameter function showing the different states in the persistenceMonitor. 
 * @param fn
 */
export const tryToSave = (fn: () => Task<any, any>) => {
	persistenceMonitor.showLoading();
	fn()
		.fork(
			err => {
				console.error(err);
				persistenceMonitor.showError();
			},
			_ => persistenceMonitor.showSuccess()
		)
	;
};
