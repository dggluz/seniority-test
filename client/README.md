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

I'm a TypeScript lover and I think it really helps me write more robust code. In that way, I chose a couple of libraries I've been working on:

#### Task

[`Tasks`](https://github.com/ts-task/task): they are basically like `Promise`s but **with typed errors**. They also have a different API: the `Promise`'s `.then` _method_ is splitted into:
* `.map`: a _functor_ method (equivalent to _Haskell_'s `fmap` or `<$>`).
* `.chain` a _monad_ method (equivalent to _Haskell_'s `bind` or `>>=`).
...while the `Promise`'s `.catch` method is maintained. It's worth to mention that a `.pipe` method was added to _pipe_ any _function_ that takes a `Task` and returns a `Task`. **It is extremely usefull to inspect a `Task`'s resolved and rejected values, by doing `.pipe(t => t)` and inspecting `t` _typings_ with _IDE_'s _IntelliSense_**.

Also, as `Task`s are _lazy_ they need to be `.fork()`ed to do their job.

#### Task/utils

[`Task/utils`](https://github.com/ts-task/utils) are utility _functions_ to work with `Task`s. The more useful and used are `caseError` (https://github.com/ts-task/utils#caseerror) and `isInstanceOf` (https://github.com/ts-task/utils#isinstanceof).

There are also a couple of _functions_ that are not in [`Task/utils`](https://github.com/ts-task/utils) yet, but they could be. I added them to this project instead. They are:

* [`tap`](https://github.com/dggluz/seniority-test/blob/master/client/src/utils/tap.ts): takes a _function_ and _calls_ it, performing its side effects but discarding its _return value_ and returning the input _parameter_ instead.
* [`tapChain`](https://github.com/dggluz/seniority-test/blob/master/client/src/utils/tap-chain.ts): Used to execute a _function_ that returns a `Task`, discarding its _resolved value_, but not the _rejected errors_.
* [`rejectIf`](https://github.com/dggluz/seniority-test/blob/master/client/src/utils/reject-if.ts): Used with `.chain`, this _function_ is useful to _reject_ a `Task` with an specified _error_ or to leave it as it is, based on a _predicate_'s (_function_ that returns a `boolean`) result.

#### Parmenides

#### Other type safety functions

### MVC

### Components

### Observable
