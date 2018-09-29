# Seniority test server

This is a node REST server.

## Setup

There are couple of _npm scripts_:

* `npm run build`: _builds_ the code.
* `npm start`: starts the _node server_ (code has to have been built before).
* `npm run build-and-run`: executes the two previous _scripts_ together.

## Arquitectural decisions

The problem (storing, retrieving, deleting and modifying) elements was perfect for a [_rest server_](https://en.wikipedia.org/wiki/Representational_state_transfer), so I chose [`restify`](http://restify.com/) as framework.

Also, as a _web server_ is mainly _stateless_ (it's _state_ is stored _outside_ and can be thought of like an _input_), I chose to use a _functional_ style for developing it.

### Endpoints (controllers)

The _endpoints_ are just _functions_ (called "_controllers_") that takes a _request object_ ([_type_ `Request`](http://restify.com/docs/request-api/)) and _return_ a [`Task`](https://github.com/ts-task/task) resolved with the _value_ to _return_ to the _client_.

They don't receive the _response object_ ([_type_ `Response`](http://restify.com/docs/response-api/)) on purpose, to _force_ delegating into the [`createEndpoint` _function_](#createendpoint).

The _returned_ `Task` can only be _rejected_ with [`HTTPErrors`](https://github.com/dggluz/seniority-test/blob/master/server/src/http-errors.ts).

### createEndpoint

A key of the server is the [`createEndpoint` _function_](https://github.com/dggluz/seniority-test/blob/master/server/src/server-utils/create-endpoint.ts). It takes a [_controller function_](#endpoints-controllers) and _returns_ a _function_ to be used as callback for [`Server`'s _REST methods_](http://restify.com/docs/server-api/) (as [`get`](http://restify.com/docs/server-api/#get), [`post`](http://restify.com/docs/server-api/#post), [`put`](http://restify.com/docs/server-api/#put), [`patch`](http://restify.com/docs/server-api/#patch) or [`del`](http://restify.com/docs/server-api/#del)).

It _calls_ the _controller_ and `.fork`s its result, sending the _resolved value_ or the _rejected_ `HTTPError` to the _client_. It ensures by it's typings that the _controller_ doesn't return a `Task` rejected on other thing than an `HttpError` or `UnknownError` (it is an interesting experiment to comment a line like [this one](https://github.com/dggluz/seniority-test/blob/master/server/src/controllers/get-items.controller.ts#L17) to corroborate it).

If another thing is rejected ar runtime, it is _logged_ as en _error_ to the _console_ and an `Internal server error` is sent to the _client_.

### Middlewares

Another key of the server are the [_middlewares_](https://github.com/dggluz/seniority-test/tree/master/server/src/middlewares). They are functions that make assertions on the [Request](http://restify.com/docs/request-api/) _objects_. If the assertions fail, they reject with an `HttpError` (tipically a `BadRequestError` but it could also be an `UnauthorizedError` or a `ForbiddenError`, depending on the intent of each _middleware_). They rely on _functions_ like the ones from [`parmenides`](https://github.com/dggluz/parmenides) to also _type_ the `req` _properties_ (that are _typed_ as `any` by default).

### Database

For the database I opted to use a [simple approach](https://github.com/dggluz/seniority-test/tree/master/server/src/db) relying in general _[curryed](https://en.wikipedia.org/wiki/Currying) functions_ to construct each [_CRUD_](https://en.wikipedia.org/wiki/Create,_read,_update_and_delete) _function_. I also provided the [typings for the "_schema_"](https://github.com/dggluz/seniority-test/blob/master/server/src/db/schemas/item.schema.d.ts) of the data to store.
