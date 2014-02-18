/*
 * grunt-mocha-protractor
 * https://github.com/noblesamurai/grunt-mocha-protractor
 */

'use strict';

var protractor = require('protractor'),
    Mocha = require('mocha'),
    path = require('path'),
    Module = require('module');

module.exports = function (grunt, fileGroup, browser, options, next) {
  var capabilities,
      driver,
      timeout = options.timeout ? options.timeout : 10000,
      suiteTimeout = options.suiteTimeout ? options.suiteTimeout : 90000;

  // if browser is a simple string, just use selenium
  if (typeof browser === 'string') {
    try {
      capabilities = protractor.Capabilities[browser.toLowerCase()]();
    } catch (error) {
      grunt.log.error('Unknown browser type: ' + JSON.stringify(browser));
      return next();
    }

    if (browser.toLowerCase() === 'chrome' && options.args) {
      options.args.forEach(function (arg) {
        capabilities.set("chrome.switches", arg);
      });
    }

    driver = new protractor.Builder().
        usingServer(options.seleniumUrl).
        withCapabilities(capabilities).build();

  // sauce labs.  assume sauce connect is running on port 4445
  } else if (typeof browser === 'object' && browser.base && browser.base.toLowerCase() === 'saucelabs') {
    var browserName = browser.browserName.toLowerCase();
    if (browserName === 'internet explorer') {
      browserName = 'ie';
    }
    capabilities = protractor.Capabilities[browserName]();
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

    driver = new protractor.Builder().
        usingServer('http://localhost:4445/wd/hub').
        withCapabilities(capabilities).build();

  } else {
    grunt.log.error('Unknown browser type: ' + JSON.stringify(browser));
    return next();
  }

  driver.manage().timeouts().setScriptTimeout(timeout);
  driver.getSession().then(function(session) {
    var ptor = protractor.wrapDriver(
      driver,
      options.baseUrl,
      options.rootElement
    );
    ptor.params = options.params;

    protractor.setInstance(ptor);

    // Export protractor to the global namespace to be used in tests.
    // (copy from https://github.com/angular/protractor/blob/master/lib/runner.js
    // runJasmineTests() function).
    global.protractor = protractor;
    global.browser = ptor;
    global.$ = ptor.$;
    global.$$ = ptor.$$;
    global.element = ptor.element;
    global.by = protractor.By;

    var finish = function(err) {
      driver.quit().then(function() { next(err); });
    };

    var mocha = new Mocha(options);
    mocha.suite.timeout(suiteTimeout);
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

    var runner;
    var d = require('domain').create();

    d.run(function() {
      runner = mocha.run(function(errCount) {
        var err;
        if (errCount !== 0) {
          err = new Error('Tests encountered ' + errCount + ' errors.');
        }
        finish(err);
      });
    });

    protractor.promise.controlFlow().on('uncaughtException', function(err) {
      if (runner) {
        runner.uncaught(err);
      }
    });
    d.on('error', function(err) {
      if (runner) {
        runner.uncaught(err);
      } else {
        grunt.log.error('Mocha failed to run');
        grunt.log.error(err.stack);
        finish(false);
      }
    });
  });
};
