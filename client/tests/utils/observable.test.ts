import { Observable } from '../../src/utils/observable.mixin';
import { EmptySuperClass } from '../../src/utils/empty-super-class';

describe('Observable', () => {
	describe('class extends Observable mixin without base class', () => {
		// GIVEN: an Observable Foo class that does inherits from EmptySuperClass...
		class Foo extends Observable<{
			foo: string,
			baz: number
		}>().from(EmptySuperClass) {
			// ...and that has a method which notifies observers...
			foo (value: string) {
				this._notifyObservers('foo', `foo: ${value}`);
				return value;
			}
		}

		it('Foo.foo returns expected value', () => {
			// GIVEN: an instance of that class
			const foo = new Foo();

			// WHEN: calling a method
			const result = foo.foo('hello!');

			// THEN: the result is the expected one.
			expect(result).toBe('hello!');
		});

		it('Foo.foo notifies its observers with the expected value', () => {
			// GIVEN: an instance of that class
			const foo = new Foo();

			// ...and a callback
			const observableCallback = jest.fn();

			// ...that observes the instance
			foo.subscribe('foo', observableCallback);
			expect(observableCallback).not.toHaveBeenCalled();

			// WHEN: a method that notifies is called
			foo.foo('hello!');

			// THEN: the callback is called with the expected parameter
			expect(observableCallback).toHaveBeenCalledWith('foo: hello!');
		});

		it('Foo.foo does not notify its observers if they are not listening to triggered event', () => {
			// GIVEN: an instance of that class
			const foo = new Foo();

			// ...and a callback
			const observableCallback = jest.fn();

			// ...that observes the instance, but for ANOTHER event
			foo.subscribe('baz', observableCallback);
			expect(observableCallback).not.toHaveBeenCalled();

			// WHEN: a method that notifies is called
			foo.foo('hello!');

			// THEN: the callback is NOT called (since it observer ANOTHER event).
			expect(observableCallback).not.toHaveBeenCalled();
		});
	});

	describe('class extends Observable mixin with base class', () => {
		// GIVEN: a superclass
		class Bar {
			bar (value: number) {
				return value * 2;
			}
		}

		// ...and an Observable class that inherits from the superclass...
		class Foo extends Observable<{
			foo: string;
			baz: string;
		}>().from(Bar) {
			foo (value: string) {
				this._notifyObservers('foo', `foo: ${value}`);
				return value;
			}
		}

		it('Foo inherits from superclass', () => {
			// GIVEN: an instance of that class
			const foo = new Foo();

			// WHEN: calling a method of the superclass
			const result = foo.bar(4);

			// THEN: the result is the expected one.
			expect(result).toBe(8);
		});


		it('Foo.foo returns expected value', () => {
			// GIVEN: an instance of that class
			const foo = new Foo();

			// WHEN: calling a method
			const result = foo.foo('hello!');

			// THEN: the result is the expected one.
			expect(result).toBe('hello!');
		});

		it('Foo.foo notifies its observers with the expected value', () => {
			// GIVEN: an instance of that class
			const foo = new Foo();

			// ...and a callback
			const observableCallback = jest.fn();

			// ...that observes the instance
			foo.subscribe('foo', observableCallback);
			expect(observableCallback).not.toHaveBeenCalled();

			// WHEN: a method that notifies is called
			foo.foo('hello!');

			// THEN: the callback is called with the expected parameter
			expect(observableCallback).toHaveBeenCalledWith('foo: hello!');
		});

		it('Foo.foo does not notify its observers if they are not listening to triggered event', () => {
			// GIVEN: an instance of that class
			const foo = new Foo();

			// ...and a callback
			const observableCallback = jest.fn();

			// ...that observes the instance, but for ANOTHER event
			foo.subscribe('baz', observableCallback);
			expect(observableCallback).not.toHaveBeenCalled();

			// WHEN: a method that notifies is called
			foo.foo('hello!');

			// THEN: the callback is NOT called (since it observer ANOTHER event).
			expect(observableCallback).not.toHaveBeenCalled();
		});
	});
});
