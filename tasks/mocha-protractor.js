/*
 * grunt-mocha-protractor
 * https://github.com/aeh/grunt-mocha-protractor
 */

'use strict';

var webdriver = require('selenium-webdriver'),
    protractor = require('protractor'),
    runner = require('../lib/runner'),
    Mocha = require('mocha'),
    path = require('path'),
    Module = require('module'),
    expect = require('expect.js');

module.exports = function(grunt) {
  grunt.registerMultiTask('mochaProtractor', 'The best Grunt plugin ever.', function() {
    var files = this.files,
        options = this.options({
          browsers: ['Chrome']
        });

    grunt.util.async.forEachSeries(options.browsers, function(browser, next) {
      if (typeof webdriver.Capabilities[browser.toLowerCase()] !== 'function') {
        grunt.log.error('Unknown brower type: "' + browser + '"');
        return next(false);
      }

      grunt.util.async.forEachSeries(files, function(fileGroup, next) {
        runner(grunt, fileGroup, browser, options, next);
      }, next);
    }, this.async());
  });
};
