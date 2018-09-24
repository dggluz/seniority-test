import { Observable } from '../../../src/utils/observable.mixin';
import { EmptySuperClass } from '../../../src/utils/empty-super-class';

interface FooObservable {
	foo: string;
	baz: number;
}

class Foo extends Observable<FooObservable>().from(EmptySuperClass) {
	foo(value: string) {
		this._notifyObservers('foo', `foo: ${value}`);
		return value;
	}
}

const foo = new Foo();
foo.foo('hello!'); // $ExpectType string

foo.subscribe('foo', x => {
	x; // $ExpectType string
});

foo.subscribe('baz', x => {
	x; // $ExpectType number
});

class Bar {
	bar(value: number) {
		return value * 2;
	}
}

class Foo2 extends Observable<{
	foo: string;
	baz: string;
}>().from(Bar) {
	foo(value: string) {
		this._notifyObservers('foo', `foo: ${value}`);
		return value;
	}
}

const foo2 = new Foo2();
foo2.bar(4); // $ExpectType number
