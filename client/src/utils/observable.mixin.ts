import { ClassType } from './class-type';

class Observer {
	constructor (private _eventName: string, private _callback: Callback<any>) {}

	notify (event: string, value: any) {
		if (this._eventName === event) {
			this._callback(value);
		}
		return this;
	}
}

export type MapOfCallbacks<T> = {
	[P in keyof T]: T[P];
};

export type Callback <T> = (x: T) => void;

export const Observable = <MC extends MapOfCallbacks<O>, O = any> () => ({
	from: <T extends ClassType<any>> (Base: T) =>
		class _Observable extends Base {
			private _observers: Observer[] = [];

			// TODO: type better the constructor to match actual Base constructor (if possible)
			constructor (...args: any[]) {
				super(...args);
			}

			subscribe <EN extends keyof MC> (eventName: EN, callback: Callback<MC[EN]>) {
				this._observers.push(new Observer(eventName as string, callback));
				return this;
			}

			protected _notifyObservers <EN extends keyof MC> (eventName: EN, value?: MC[EN]) {
				this._observers.forEach(anObserver => anObserver.notify(eventName as string, value));
				return this;
			}
		}
});

