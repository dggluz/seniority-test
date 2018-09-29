import { Observable } from '../../../src/utils/observable.mixin';
import { EmptySuperClass } from '../../../src/utils/empty-super-class';

// GIVEN: an Observable class that extends from EmptySuperClass
class Foo extends Observable<{
	foo: string;
	baz: number;
}>().from(EmptySuperClass) {
	foo(value: string) {
		this._notifyObservers('foo', `foo: ${value}`);
		// We can notify observers with an unexpected type:
		this._notifyObservers('baz', `baz: ${value}`); // $ExpectError
		return value;
	}
}

// THEN:
const foo = new Foo();
// ...we can call class methods
foo.foo('hello!'); // $ExpectType string
// ...but only with expected types
foo.foo(8); // $ExpectError

// ...we can subscribe to events (which are typed themselves)
foo.subscribe('foo', x => {
	x; // $ExpectType string
});

// ...we can subscribe to another event (with other typings)
foo.subscribe('baz', x => {
	x; // $ExpectType number
});

// GIVEN: a superclass
class Bar {
	bar(value: number) {
		return value * 2;
	}
}

// ...and an Observable class that inherits from the superclass
class Foo2 extends Observable<{
	foo: string;
	baz: string;
}>().from(Bar) {
	foo(value: string) {
		this._notifyObservers('foo', `foo: ${value}`);
		// We can notify observers with an unexpected type:
		this._notifyObservers('bar', 4); // $ExpectError
		return value;
	}
}

// THEN:
const foo2 = new Foo2();
// ... we can call superclass methods
foo2.bar(4); // $ExpectType number
// ...but only with expected types
foo2.bar('4'); // $ExpectError
