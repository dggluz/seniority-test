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

### Infra

I chose to make a _docker multistage builds_ to provide only the source code of all the project and to allow the server to serve the SPA.

There are two stages: the first one builds the client code and the second one serves it as static assets and also exposes server's API. 

### Client

See [client's documentation](./client).

### Server

See [server's documentation](./server).

