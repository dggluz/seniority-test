import { ClassType } from './class-type';

/**
 * @ignore
 * Internal use. It is just an object that stores information about an event name and a callback
 * and calls the callback when the event name matches.
 */
class Observer {
	/**
	 * @param _eventName the event name
	 * @param _callback the callback
	 */
	constructor (private _eventName: string, private _callback: Callback<any>) {}

	/**
	 * Calls the callback with the supplied value, when the event matches.
	 * @param event
	 * @param value
	 */
	notify (event: string, value: any) {
		if (this._eventName === event) {
			this._callback(value);
		}
		return this;
	}
}

/**
 * Just a hashmap to values (of callbacks parameters).
 */
export type MapOfCallbacks<T> = {
	[P in keyof T]: T[P];
};

/**
 * Unary function to void.
 */
export type Callback <T> = (x: T) => void;

/**
 * Function that returns an object with the mixin function.
 * It is only used to specify the Observer's callback types corresponding to each event name.
 * @returns object with only one method (`from`) that takes the superclass and returns the mixin.
 */
export const Observable = <MC extends MapOfCallbacks<any>> () => ({
	/**
	 * @param Base the superclass to inherit from
	 * @return The Observable Mixin
	 */
	from: <T extends ClassType<any>> (Base: T) =>
		/**
		 * Observable mixin
		 */
		class _Observable extends Base {
			private _observers: Observer[] = [];

			/**
			 * Subscribes an observer to an event
			 * @param eventName the event to which is subscribed the observer
			 * @param callback the function callback that will be called when the observable notifies the event.
			 */
			subscribe <EN extends keyof MC> (eventName: EN, callback: Callback<MC[EN]>) {
				this._observers.push(new Observer(eventName as string, callback));
				return this;
			}

			/**
			 * Internal method (intended to be called by subclasses). It notifies the observers of an event.
			 * @param eventName Event name to notify
			 * @param value Associated value that will be passed to callbacks.
			 */
			protected _notifyObservers <EN extends keyof MC> (eventName: EN, value: MC[EN]) {
				this._observers.forEach(anObserver => anObserver.notify(eventName as string, value));
				return this;
			}
		}
});

