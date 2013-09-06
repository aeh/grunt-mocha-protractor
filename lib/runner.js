/*
 * grunt-mocha-protractor
 * https://github.com/aeh/grunt-mocha-protractor
 */

'use strict';

var webdriver = require('selenium-webdriver'),
    protractor = require('protractor'),
    Mocha = require('mocha'),
    path = require('path'),
    Module = require('module');

module.exports = function (grunt, fileGroup, browser, options, next) {
  var capabilities = webdriver.Capabilities[browser.toLowerCase()]();
  if (browser === 'Chrome' && options.args) {
    options.args.forEach(function (arg) {
      capabilities.set("chrome.switches", arg);
    })
  }

  var driver = new webdriver.Builder().
      usingServer('http://localhost:4444/wd/hub').
      withCapabilities(capabilities).build();

  driver.manage().timeouts().setScriptTimeout(10000);
  var ptor = protractor.wrapDriver(driver, options.baseUrl);

  var finish = function(err) {
    driver.quit().then(function() { next(err); });
  };

  var mocha = new Mocha(options);
  mocha.suite.timeout(50000);
  mocha.suite.on('pre-require', function(context, file, m) {
    if (Module._cache[file]) {
      delete Module._cache[file];
    }
    this.ctx.ptor = ptor;
    this.ctx.browser = browser;
    this.ctx.file = file;
  });
  grunt.file.expand({filter: 'isFile'}, fileGroup.src).forEach(function(file) {
    mocha.addFile(path.resolve(file));
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
