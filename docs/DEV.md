# Development environment
This document describes development environment for the project. It also mentions good practices that should be followed by the developers.

## Tests
Each class or widget should be covered by unit tests. The following frameworks are used in the project:

* [QUnit](http://qunitjs.com) (front-end)
* [Mocha](mocha test) with [Chai](http://chaijs.com) assertion library (back-end)

The source code of unit tests is kept in `test/` directory. The filename should prefixed with either `qunit-` or `mocha-`. 

## Linting
The project uses [ESLint](http://eslint.org) to validate JavaScript syntax and coding style. The rules are defined in `.eslint` file and follow O<sup>2</sup> JavaScript Coding Guideline.

## Documentation
Documentation is handled with help of [JSDoc 3](http://usejsdoc.org) API generator.
The complete API of the project is available in [API.md](API.md) file.

## Build system
[Gulp](http://gulpjs.com) helps to automate tasks such as:

* Running unit tests: `gulp test`
* Linting JS code: `gulp eslint`
* Generating API: `gulp doc`

The tasks are specified in `gulpfile.js` configuration file.

## Continuous integration
[Travis CI](https://travis-ci.org/AliceO2Group/ControlGui) runs unit test each time the new code is pushed to the repository. The steps of build environment are specified in `.travis.yml` file.

## Dependencies status
The versions of [dependencies](https://david-dm.org/AliceO2Group/ControlGui) and [development dependencies](https://david-dm.org/AliceO2Group/ControlGui?type=dev) are monitored by David service.