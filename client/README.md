# Seniority test client

This is a single page application.

## Build

* `npm install`
* `npm run build`

## Testing

The whole project has little tests as it's a code challenge and I didn't want to delay it too much. Anyway, and as an example, I included tests for a key piece of code: the [`Observable` _mixin_](#observable).

There two kind of tests:

* **Unit tests** with **code coverage**, written in [`jest`](https://jestjs.io/). Can be ran with `npm t`. I tried to follow a "_GIVEN/WHEN/THEN_" style for them.
* **Typing tests** with [`dtslint`](https://github.com/Microsoft/dtslint). Can be ran with `npm run test:types` (empty output means success).

## Arquitectural decisions

### Building

As the UI is organized in [`Components`](#components), I needed a way to build TypeScript code, along with its HTML and styles. So I pick [`webpack`](https://webpack.js.org/) for the job. I'm also using [`less`](http://lesscss.org/) to ease styles develpment. The same way I could also have used a _template engine_ (like [`pug`](https://pugjs.org/)) if I wanted to, not restricting development to a single tool (like _JSX_, for instance, would have done).

### Type-safety and error handling

I'm a [TypeScript](http://www.typescriptlang.org/) lover and I think it really helps me write more robust code. In that way, I chose a couple of libraries I've been working on:

#### Task

[`Tasks`](https://github.com/ts-task/task): they are basically like `Promise`s but **with typed errors**. They also have a different API: the `Promise`'s `.then` _method_ is splitted into:
* `.map`: a _functor_ method (equivalent to _Haskell_'s `fmap` or `<$>`).
* `.chain` a _monad_ method (equivalent to _Haskell_'s `bind` or `>>=`).
...while the `Promise`'s `.catch` method is maintained. It's worth to mention that a `.pipe` method was added to _pipe_ any _function_ that takes a `Task` and returns a `Task`. **It is extremely usefull to inspect a `Task`'s resolved and rejected values, by doing `.pipe(t => t)` and inspecting `t` _typings_ with _IDE_'s _IntelliSense_**.

Also, as `Task`s are _lazy_ they need to be `.fork()`ed to do their job.

#### Task/utils

[`Task/utils`](https://github.com/ts-task/utils) are utility _functions_ to work with `Task`s. The more useful and used are [`caseError`](https://github.com/ts-task/utils#caseerror) and [`isInstanceOf`](https://github.com/ts-task/utils#isinstanceof).

There are also a couple of _functions_ that are not in [`Task/utils`](https://github.com/ts-task/utils) yet, but they could be. I added them to this project instead. They are:

* [`tap`](https://github.com/dggluz/seniority-test/blob/master/client/src/utils/tap.ts): takes a _function_ and _calls_ it, performing its side effects but discarding its _return value_ and returning the input _parameter_ instead.
* [`tapChain`](https://github.com/dggluz/seniority-test/blob/master/client/src/utils/tap-chain.ts): Used to execute a _function_ that returns a `Task`, discarding its _resolved value_, but not the _rejected errors_.
* [`rejectIf`](https://github.com/dggluz/seniority-test/blob/master/client/src/utils/reject-if.ts): Used with `.chain`, this _function_ is useful to _reject_ a `Task` with an specified _error_ or to leave it as it is, based on a _predicate_'s (_function_ that returns a `boolean`) result.

#### Parmenides

[`Parmenides`](https://github.com/dggluz/parmenides) is a library that ensure's in _runtime_ that the _types_ are the expected ones. Suppose you have an _input value_ (a _request_'s result, for instance). TypeScript itself can't infer any type for that value, so **you tell TypeScript that value's _type_**. [`Parmenides`](https://github.com/dggluz/parmenides) just checks in runtime that what you told TypeScript is true, and also types the result.

#### Other type safety functions

There were a couple of situations where the preceding tools were not enough to guarantee type safety, so I developed a couple of _functions_:

* [`as`](https://github.com/dggluz/seniority-test/blob/master/client/src/utils/as.ts): [`JQuery`](https://jquery.com/)'s [_typings_](https://www.npmjs.com/package/@types/jquery) won't tell you that an `Event` is actually a [`DragEvent`](https://developer.mozilla.org/en-US/docs/Web/API/DragEvent), even if you know it _should_ be. In that case I use `as` to _assert_ that it is. I couldn't have used only [`instanceOf`](https://github.com/dggluz/parmenides#instanceof) `Parmenide`'s _function_, since it expects it's parameter to be an _instance_ of the supplied _Constructor_, and an instance of `Event` is not assignable to `DragEvent`.

* [`ensure`](https://github.com/dggluz/seniority-test/blob/master/client/src/utils/ensure.ts): take the [`FileReader`'s _API_](https://developer.mozilla.org/es/docs/Web/API/FileReader#Methods) as an example. The `.result` property could be `string` or `ArrayBuffer` based on which _method_ ([`.readAsArrayBuffer`](https://developer.mozilla.org/es/docs/Web/API/FileReader/readAsArrayBuffer), [`.readAsText`](https://developer.mozilla.org/es/docs/Web/API/FileReader/readAsText) or [`.readAsDataURL`](https://developer.mozilla.org/es/docs/Web/API/FileReader/readAsDataURL)) was called. So, even when _you know_ which type it _should be_ it's good to _ensure_ it is, and that is what `ensure` _function_ does.

### MVC

### Components

### Observable
