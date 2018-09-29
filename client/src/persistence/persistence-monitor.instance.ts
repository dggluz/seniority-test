import { PersistenceMonitorComponent } from '../components/persistence-monitor/persistence-monitor.component';

/**
 * Singleton instance of the PersistenceMonitor
 */
export const persistenceMonitor = new PersistenceMonitorComponent()
	.appendTo('body')
;
