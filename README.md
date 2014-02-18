# grunt-mocha-protractor

> Run e2e angular tests with webdriver.

[![Build Status](https://travis-ci.org/noblesamurai/grunt-mocha-protractor.png)](https://travis-ci.org/noblesamurai/grunt-mocha-protractor)

## Getting Started

This plugin requires Grunt `~0.4.1`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-mocha-protractor --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-mocha-protractor');
```

## The "mochaProtractor" task

### Overview

Currently you will need to have the Selenium Server running in the default location on localhost.

In your project's Gruntfile, add a section named `mochaProtractor` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  mochaProtractor: {
    options: {
      browsers: ['Chrome', 'Firefox']
    },
    files: ['test/*.js']
  },
})
```

### Options

The usual Mocha options are passed through this task to the new Mocha instance.

#### options.browsers

Type: `Array`
Default value: `['Chrome']`

List of browsers to test with.

To test with SauceLabs the browser can also be specified as an object.

```js
grunt.initConfig({
  mochaProtractor: {
    options: {
      reporter: 'Spec',
      browsers: [{
        base: 'SauceLabs',
        browserName: 'Firefox',
        platform: 'Windows 7',
        version: '23'
      }]
    },
    files: ['test/*.js']
  },
```

#### options.reporter

Type: `String`
Default value: `Spec`

Mocha reporter to use

#### options.baseUrl

Type: `String`
Default value: ``

#### options.args

Type: `Array`
Default value: `null`

Example of full config

```js
grunt.initConfig({
  mochaProtractor: {
    options: {
      browsers: ['Chrome', 'Firefox'],
      reporter: 'Spec',
      baseUrl: 'https://develop.mywebsite.local',
      args: '--ignore-certificate-errors',
      timeout: 10000, // in milliseconds
      suiteTimeout: 90000 // in milliseconds
    },
    files: ['test/*.js']
  },
})
```

## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History

* v0.5.0 - add seleniumUrl param, fixed "max call stack" error (thanks nowells).
* v0.4.0 - added protractor globals.
* v0.3.2 - add rootElement and params options (thanks AdamQuadmon).
* v0.3.1 - update dependencies.
* v0.3.0 - better error handling.
* v0.2.0 - added saucelabs support.
* v0.1.0 - initial release.
