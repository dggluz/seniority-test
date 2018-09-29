import { Task } from '@ts-task/task';
import { persistenceMonitor } from './persistence-monitor.instance';

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
