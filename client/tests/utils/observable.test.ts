import { Observable } from '../../src/utils/observable.mixin';
import { EmptySuperClass } from '../../src/utils/empty-super-class';

describe('Observable', () => {
	describe('class extends Observable mixin without base class', () => {
		class Foo extends Observable(EmptySuperClass) {
			foo (value: string) {
				this._notifyObservers('foo', `foo: ${value}`);
				return value;
			}
		}

		it('Foo.foo returns expected value', () => {
			const foo = new Foo();
			expect(foo.foo('hello!')).toBe('hello!');
		});

		it('Foo.foo notifies its observers with the expected value', () => {
			const observableCallback = jest.fn();
			const foo = new Foo();
			foo.subscribe('foo', observableCallback);
			expect(observableCallback).not.toHaveBeenCalled();
			foo.foo('hello!');
			expect(observableCallback).toHaveBeenCalledWith('foo: hello!');
		});

		it('Foo.foo does not notify its observers if they are not listening to triggered event', () => {
			const observableCallback = jest.fn();
			const foo = new Foo();
			foo.subscribe('baz', observableCallback);
			expect(observableCallback).not.toHaveBeenCalled();
			foo.foo('hello!');
			expect(observableCallback).not.toHaveBeenCalled();
		});
	});

	describe('class extends Observable mixin with base class', () => {
		class Bar {
			bar (value: number) {
				return value * 2;
			}
		}

		class Foo extends Observable(Bar) {
			foo (value: string) {
				this._notifyObservers('foo', `foo: ${value}`);
				return value;
			}
		}

		it('Foo inherits from superclass', () => {
			const foo = new Foo();
			expect(foo.bar(4)).toBe(8);
		});

		it('Foo.foo returns expected value', () => {
			const foo = new Foo();
			expect(foo.foo('hello!')).toBe('hello!');
		});

		it('Foo.foo notifies its observers with the expected value', () => {
			const observableCallback = jest.fn();
			const foo = new Foo();
			foo.subscribe('foo', observableCallback);
			expect(observableCallback).not.toHaveBeenCalled();
			foo.foo('hello!');
			expect(observableCallback).toHaveBeenCalledWith('foo: hello!');
		});

		it('Foo.foo does not notify its observers if they are not listening to triggered event', () => {
			const observableCallback = jest.fn();
			const foo = new Foo();
			foo.subscribe('baz', observableCallback);
			expect(observableCallback).not.toHaveBeenCalled();
			foo.foo('hello!');
			expect(observableCallback).not.toHaveBeenCalled();
		});
	});
});
