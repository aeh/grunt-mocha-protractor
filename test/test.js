var protractor = require('protractor'),
    expect = require('expect.js');

describe('angularjs.org homepage', function() {
  it('should greet using binding', function(done) {
    var ptor = this.ptor;

    ptor.get('http://www.angularjs.org');

    ptor.findElement(protractor.By.input('yourName')).sendKeys('Julie');

    ptor.findElement(protractor.By.binding('{{yourName}}')).
      getText().then(function(text) {
        expect(text).to.eql('Hello Julie!');
        done();
      });
  });

  it('should list todos', function(done) {
    var ptor = this.ptor;

    ptor.get('http://www.angularjs.org');

    var todo = ptor.findElement(
        protractor.By.repeater('todo in todos').row(2));

    todo.getText().then(function(text) {
      expect(text).to.eql('build an angular app');
      done();
    });
  });
});
