/*
 * grunt-mocha-protractor
 * https://github.com/noblesamurai/grunt-mocha-protractor
 */

'use strict';

var protractor = require('protractor'),
    runner = require('../lib/runner'),
    reporter = require('../lib/reporter'),
    Mocha = require('mocha'),
    path = require('path'),
    Module = require('module'),
    expect = require('expect.js');

module.exports = function(grunt) {
  grunt.registerMultiTask('mochaProtractor', 'Run e2e angular tests with webdriver.', function() {
    var files = this.files,
        options = this.options({
          browsers: [{
            'browserName': 'phantomjs',
            'phantomjs.binary.path': require('phantomjs').path,
            'phantomjs.ghostdriver.cli.args': ['--loglevel=DEBUG']
          }],
          reporter: 'Spec',
          args: null,
          seleniumUrl: 'http://localhost:4444/wd/hub',

          // saucelabs options
          sauceUsername: process.env.SAUCE_USERNAME,
          sauceAccessKey: process.env.SAUCE_ACCESS_KEY,

          // protractor config
          baseUrl: '',
          rootElement: '',
          params: {}
        });

    // wrap reporter
    options.reporter = reporter(options.reporter);

    grunt.util.async.forEachSeries(options.browsers, function(browser, next) {
      grunt.util.async.forEachSeries(files, function(fileGroup, next) {
        runner(grunt, fileGroup, browser, options, next);
      }, next);
    }, this.async());
  });
};
