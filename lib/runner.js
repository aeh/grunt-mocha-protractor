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
  var capabilities,
      driver;

  // if browser is a simple string, just use selenium
  if (typeof browser === 'string') {
    try {
      capabilities = webdriver.Capabilities[browser.toLowerCase()]();
    } catch (error) {
      grunt.log.error('Unknown browser type: ' + JSON.stringify(browser));
      return next();
    }

    if (browser.toLowerCase() === 'chrome' && options.args) {
      options.args.forEach(function (arg) {
        capabilities.set("chrome.switches", arg);
      });
    }

    driver = new webdriver.Builder().
        usingServer('http://localhost:4444/wd/hub').
        withCapabilities(capabilities).build();

  // sauce labs.  assume sauce connect is running on port 4445
  } else if (typeof browser === 'object' && browser.base && browser.base.toLowerCase() === 'saucelabs') {
    var browserName = browser.browserName.toLowerCase();
    if (browserName === 'internet explorer') {
      browserName = 'ie';
    }
    capabilities = webdriver.Capabilities[browserName]();
    capabilities.merge({
      username: options.sauceUsername,
      accessKey: options.sauceAccessKey,
      name: options.sauceSession,
      browserName: browser.browserName,
      platform: browser.platform,
      version: browser.version,
      'record-video': browser.recordVideo
    });

    if (options.sauceTunnelId) {
      capabilities.set('tunnel-identifier', options.sauceTunnelId);
    }

    driver = new webdriver.Builder().
        usingServer('http://localhost:4445/wd/hub').
        withCapabilities(capabilities).build();

  } else {
    grunt.log.error('Unknown browser type: ' + JSON.stringify(browser));
    return next();
  }

  driver.manage().timeouts().setScriptTimeout(10000);
  var ptor = protractor.wrapDriver(driver, options.baseUrl);

  var finish = function(err) {
    driver.quit().then(function() { next(err); });
  };

  var mocha = new Mocha(options);
  mocha.suite.timeout(90000);
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
};
