var webdriver = require('selenium-webdriver'),
    expect = require('expect.js');

describe('catching errors', function() {
  /**
   * If uncommented these should all fail but still cleanup and close any
   * selenium connections etc...
   *
  it('should not catch simple exceptions', function(done) {
    expect(true).to.be(false);
    done();
  });

  it('should not catch delayed exceptions', function(done) {
    setTimeout(function() {
      expect(true).to.be(false);
      done();
    }, 1000);
  });

  it('should catch webdriver exceptions', function(done) {
    var flow = webdriver.promise.controlFlow();
    flow.execute(function() {
      return webdriver.promise.delayed(250);
    }).then(function() {
      expect(true).to.be(false);
      done();
    });
  });
  */
});
