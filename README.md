## Description

An inspired by netflix website, for practice purpose, backend side.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Using docker

Or you can use docker while handling the database yourself
```
docker build . -t spaceflix-backend
docker run -p 3000:3000 spaceflix-backend   
```

You can use docker compose if you don't want to handle the database yourself
```
docker-compose up --build 
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Access swagger localhost

http://localhost:3000/api/#

## Default User credentials
```bash
email: daniel.bentz@test.com
password: password
```

## Features
```bash
- Login/logout/refresh system that uses an Access Token for authentication (which expires after a short period) and a Refresh Token to obtain a new Access Token without requiring the user to log in again.
- Customized Logging system that tracks a unique UUID for each request, enabling easy searching and correlation of logs related to a specific request.
- Testing using e2e tests for each endpoints
- Registration with multi steps (ongoing)
```