/*
 * grunt-mocha-protractor
 * https://github.com/aeh/grunt-mocha-protractor
 */

'use strict';

var webdriver = require('selenium-webdriver'),
    protractor = require('protractor'),
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
        runner(browser.toLowerCase(), fileGroup, options, next);
      }, next);
    }, this.async());
  });

  function runner(browser, fileGroup, options, next) {
    // connect to selenium
    var driver = new webdriver.Builder().
        usingServer('http://localhost:4444/wd/hub').
        withCapabilities(webdriver.Capabilities[browser.toLowerCase()]()).build();
    driver.manage().timeouts().setScriptTimeout(10000);
    var ptor = protractor.wrapDriver(driver);

    var finish = function(err) {
      driver.quit().then(function() { next(err); });
    };

    var mocha = new Mocha(options);

    mocha.suite.timeout(50000);
    mocha.suite.on('pre-require', function(context, file, m) {
      this.ctx.ptor = ptor;
    });

    grunt.file.expand({filter: 'isFile'}, fileGroup.src).forEach(function(f) {
      var filePath = path.resolve(f);
      if (Module._cache[filePath]) {
        delete Module._cache[filePath];
      }
      mocha.addFile(filePath);
    });

    try {
      mocha.run(function(errCount) {
        var err;
        if (errCount !== 0) {
          err = new Error('Tests encountered ' + errCount + ' errors.');
        }
        finish(err);
      });
    } catch (e) {
      grunt.log.error('Mocha failed to run');
      grunt.log.error(e.stack);
      finish(false);
    }
  }
};
