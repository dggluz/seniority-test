# Seniority test client

This is a single page application.

## Build

* `npm install`
* `npm run build`

## Testing

The whole project has little tests as it's a code challenge and I didn't want to delay it too much. Anyway, and as an example, I included tests for a key piece of code: the [`Observable` _mixin_](#Observable).

There two kind of tests:

* **Unit tests** with **code coverage**, written in [`jest`](https://jestjs.io/). Can be ran with `npm t`. I tried to follow a "_GIVEN/WHEN/THEN_" style for them.
* **Typing tests** with [`dtslint`](https://github.com/Microsoft/dtslint). Can be ran with `npm run test:types` (empty output means success).

## Arquitectural decisions

### Building

### Type-safety and error handling

### MVC

### Components

### Observable
