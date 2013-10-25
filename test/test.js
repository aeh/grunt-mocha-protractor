var protractor = require('protractor'),
    expect = require('expect.js');

var check = function(done, f) {
  try {
    f();
    done();
  } catch (err) {
    done(err);
  }
};

describe('angularjs.org homepage', function() {
  it('should greet using binding', function(done) {
    var ptor = this.ptor;

    ptor.get('http://localhost:3000/');

    ptor.findElement(protractor.By.input('yourName')).sendKeys('Julie');

    ptor.findElement(protractor.By.binding('{{yourName}}')).
      getText().then(function(text) {
        check(done, function() {
          expect(text).to.eql('Hello Julie!');
        });
      });
  });

  it('should list todos', function(done) {
    var ptor = this.ptor;

    ptor.get('http://localhost:3000/');

    var todo = ptor.findElement(
        protractor.By.repeater('todo in todos').row(1));

    todo.getText().then(function(text) {
      check(done, function() {
        expect(text).to.eql('build an angular app');
      });
    });
  });
});
