# Candidate Interview Project

## Project Overview

Welcome to the interview project! This project is designed to assess your skills in building a backend API using Node.

### Goals

- Understand your proficiency with Node.
- Assess your ability to design and implement a scalable API.
- Evaluate your coding practices and problem-solving approach.

## Installation

```bash
$ npm install
or
$ yarn
```

## (Optional) generate prisma files

```bash
$ npm run prisma generate
or
$ yarn prisma generate

```

## Running the app

```bash
$ npm run start:dev
or
$ yarn start:dev
```

## Test

```bash
$ npm run test
or
$ yarn test
```


Hello! I tried to accomplish all the bonus requirements of the project, and I was able to do it. But I got some problems with my e2e tests, my seed is running into a foreign key problem I just wasn't able to fix on time. BUT overall, everything is working correctly. The only problem is that if you run the seed and then run the tests twice, the second execution will fail and throw an error in the seed file, I'm really sad I could not fix that on time, but I focused on delivering all the requirements

I added the postman collection in the repository where you can execute all the created routes, I used REST to develop the application.

Requirements

- CRUD OPERATIONS
- Query filters
- Pagination - used offset pagination
- Sorting
- Rate limiting - I used nestjs rate limiting package
- Caching - I used nestjs cache package
- Input validation using class-validator
- Handle errors - I admit I didn't work much on handling errors.
- Unit tests
- Convert the “type” field into a many-to-many table - Took some time for this one
- Create an “importPokemonById” rest endpoint - this one was pretty fun to do.

I didn't change much of the project because I was focused on developing all the funcionalities and that's it. I'm open to feedback because there are problably many things to improve in the app but overall it was really fun working on it. 