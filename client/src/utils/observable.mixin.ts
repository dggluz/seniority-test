interface ClassType <T> {
	new (...args: any[]): T;
};

class Observer <T> {
	constructor (private _eventName: string, private _callback: (x: T) => void) {}

	notify (event: string, value: T) {
		if (this._eventName === event) {
			this._callback(value);
		}
		return this;
	}
}

// TODO: type observers types from a generic map to functions

export const Observable = <T extends ClassType<any>> (Base: T) =>
	class extends Base {
		private _observers: Observer<any>[] = [];

		// TODO: type better the constructor to match actual Base constructor (if possible)
		constructor (...args: any[]) {
			super(...args);
		}

		subscribe <T> (eventName: string, callback: (x: T) => void) {
			this._observers.push(new Observer(eventName, callback));
			return this;
		}

		protected _notifyObservers <T = any> (event: string, value: T = undefined as any) {
			this._observers.forEach(anObserver => anObserver.notify(event, value));
			return this;
		}
	}
;
