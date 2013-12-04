var expect = require('expect.js');

describe('angularjs.org homepage (with protractor globals)', function() {
  it('should have defined globals', function(done) {
    expect(global).to.have.key('protractor');
    expect(global).to.have.key('browser');
    expect(global).to.have.key('$');
    expect(global).to.have.key('$$');
    expect(global).to.have.key('element');
    expect(global).to.have.key('by');
    done();
  });

  it('should greet using binding', function(done) {

    browser.get('http://localhost:3000/');

    browser.findElement(by.input('yourName')).sendKeys('Julie');

    browser.findElement(by.binding('{{yourName}}')).
      getText().then(function(text) {
        expect(text).to.eql('Hello Julie!');
        done();
      });
  });

  it('should list todos', function(done) {

    browser.get('http://localhost:3000/');

    browser.findElement(by.repeater('todo in todos').row(1)).
      getText().then(function(text) {
        expect(text).to.eql('build an angular app');
        done();
      });
  });
});
