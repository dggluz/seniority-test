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

### Type safety and error handling

Adding to the [general type safety and error handling considerations](../#):

#### Other type safety functions

There were a couple of situations where the preceding tools were not enough to guarantee type safety, so I developed a couple of _functions_:

* [`as`](https://github.com/dggluz/seniority-test/blob/master/client/src/utils/as.ts): [`JQuery`](https://jquery.com/)'s [_typings_](https://www.npmjs.com/package/@types/jquery) won't tell you that an `Event` is actually a [`DragEvent`](https://developer.mozilla.org/en-US/docs/Web/API/DragEvent), even if you know it _should_ be. In that case I use `as` to _assert_ that it is. I couldn't have used only [`instanceOf`](https://github.com/dggluz/parmenides#instanceof) `Parmenide`'s _function_, since it expects it's parameter to be an _instance_ of the supplied _Constructor_, and an instance of `Event` is not assignable to `DragEvent`.

* [`ensure`](https://github.com/dggluz/seniority-test/blob/master/client/src/utils/ensure.ts): take the [`FileReader`'s _API_](https://developer.mozilla.org/es/docs/Web/API/FileReader#Methods) as an example. The `.result` property could be `string` or `ArrayBuffer` based on which _method_ ([`.readAsArrayBuffer`](https://developer.mozilla.org/es/docs/Web/API/FileReader/readAsArrayBuffer), [`.readAsText`](https://developer.mozilla.org/es/docs/Web/API/FileReader/readAsText) or [`.readAsDataURL`](https://developer.mozilla.org/es/docs/Web/API/FileReader/readAsDataURL)) was called. So, even when _you know_ which type it _should be_ it's good to _ensure_ it is, and that is what `ensure` _function_ does.

### MVC

I opted for a kind of `MVC` architecture for the client. I think it helps reasoning and separation of concerns when it is well done (and I consider there was a lot of confusion regarding those acronym). In that sense, I think of the _model_ not as _plain data-objects_ but as _objects_ with _bussiness rules_ and _behaviour_ which knows nothing about the _views_. In the same way, I think of _views_ not only as _templates_ but as objects that interact with the _DOM_ ([`Components`](#components)).

I have also avoided any _double binding_ solution. The _views_ send message directly to the _models_ but the _models_ _notify_ their changes through [_events_](#observable) as they should know nothing about _views_ or _persistence_.

### Components

A _component_ is an _object_ that interacts with the [_DOM_](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Introduction). A made [`Component`](https://github.com/dggluz/seniority-test/blob/master/client/src/components/component.ts) _superclass_ to manage the _components_'s setup. The _components_ **must** include their _html_ code and _can_ include it's styles (_less_ code).

All the _view_'s are `Component`'s, but not all the `Component`'s are _views_, since not all of them have a corresponding _model_.

### Observable

_Models_ communicate their changes through _events_, implementing the [_observable pattern_](https://en.wikipedia.org/wiki/Observer_pattern) through the [`Observable`](https://github.com/dggluz/seniority-test/blob/master/client/src/utils/observable.mixin.ts) [_mixin_](#mixins). The decision of developing it as a _mixin_ is based on the fact that it is a very general feature, with high coupling to the _class_ and it allows _subclassing_ a _Parent class_.

This version of _observables_ associate a _type_ to each _event_. For instance, if a [_model_ `Item`](https://github.com/dggluz/seniority-test/blob/master/client/src/model/item.ts) changes its _description_, [it _notifies_ its _observers_](https://github.com/dggluz/seniority-test/blob/master/client/src/model/item.ts#L73) whith a `description` _event_ and an associated `string` _value_. Those _typings_ are specified when _extending_ the [`Observable` _mixin_](https://github.com/dggluz/seniority-test/blob/master/client/src/model/item.ts#L36) and are then validated by TypeScript's type checker.

This module is the only one that have [_tests_](#testing).

### Mixins

[_Mixins_](https://en.wikipedia.org/wiki/Mixin) where implemented as recommended by [this doc](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-2.html). As [TypeScript can not _subclass_ from a _type parameter_](https://github.com/Microsoft/TypeScript/issues/4890#issuecomment-141879451) it was impossible to use a _default superclass_, so telling **explicitly** which _superclass_ to extend from _extending_ is necessary. That is why an [`EmptySuperClass`](https://github.com/dggluz/seniority-test/blob/master/client/src/utils/empty-super-class.ts) was added.

### Persistence

The [_persistence_](https://github.com/dggluz/seniority-test/tree/master/client/src/persistence), as the _views_, talk to the _models_ and is _subscribed_ to _model events_, so the _model_ should not worry about _persistence_ at all.

[The decision](../server) of making the _server_ a _REST server_, has lead [to update an _item_'s order only changing it's own order (not others)](https://github.com/dggluz/seniority-test/blob/master/client/src/model/items-store.ts#L73).
