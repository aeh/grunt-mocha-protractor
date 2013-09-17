/*
 * grunt-mocha-protractor
 * https://github.com/aeh/grunt-mocha-protractor
 */

'use strict';

var Mocha = require('mocha'),
    util = require('util'),
    Base = Mocha.reporters.Base,
    cursor = Base.cursor,
    color = Base.color;

module.exports = function(reporter) {

  // find the requested reporter...
  var reporterClass = Base;
  Object.keys(Mocha.reporters).forEach(function(key) {
    if (key.toLowerCase() === reporter.toLowerCase()) {
      reporterClass = key;
    }
  });

  function Reporter(runner) {
    Mocha.reporters[reporterClass].call(this, runner);

    var self = this;

    var listeners = runner.listeners('suite');
    runner.removeAllListeners('suite');
    runner.on('suite', function(suite) {
      suite.tests.forEach(function(test) {
        var browser = suite.ctx.browser;
        if (typeof browser === 'object') {
          browser = browser.browserName +
            (browser.version ? ' ' + browser.version : '') +
            (browser.platform ? ' on ' + browser.platform : '');
        }
        test.title = '[' + browser + '] ' + test.title;
      });

      listeners.forEach(function(listener) {
        listener.call(self, suite);
      });
    });
  }

  /**
   * Inherit from `Base.prototype`
   */
  util.inherits(Reporter, Mocha.reporters[reporterClass]);

  return Reporter;
};
