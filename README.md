# Seniority test

This project is just a seniority test.

## Instalation

### Requirements

* `git`
* `docker engine` with support for _multistage builds_ and _compose file format_ `3.7` (from `18.06.0`)
* `docker-compose` with support for _compose file format_ `3.7` (from `1.22.0`).
* Modern web browser
* Check ports `8080` and `27017` are available
* Check your internet connection

### Instructions

* Clone the repo (`git clone git@github.com:dggluz/seniority-test.git`)
* Move to project directory (`cd seniority-test`)
* Launch _docker-compose_ (`docker-compose up`) and wait for it to finish
* [Browse to `http://localhost:8080`](http://localhost:8080)

## Arquitectural decisions

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


### Infra

I chose to make a _docker multistage builds_ to provide only the source code of all the project and to allow the server to serve the SPA.

There are two stages: the first one builds the client code and the second one serves it as static assets and also exposes server's API. 

### Client

See [client's documentation](./client).

### Server

See [server's documentation](./server).

