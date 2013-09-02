/*
 * grunt-mocha-protractor
 * https://github.com/aeh/grunt-mocha-protractor
 */

'use strict';

var Mocha = require('mocha'),
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
        test.title = '[' + suite.ctx.browser + '] ' + test.title;
      });

      listeners.forEach(function(listener) {
        listener.call(self, suite);
      });
    });
  }

  /**
   * Inherit from `Base.prototype`
   */
  Reporter.prototype.__proto__ = Mocha.reporters[reporterClass].prototype;

  return Reporter;
}
