if (typeof require !== 'undefined') {
  var Validator = require('../src/validator.js');
  var expect = require('chai').expect;
} else {
  var Validator = window.Validator;
  var expect = window.chai.expect;
}

describe('register a custom validation rule', function() {
  it('should be able to get validation rule', function() {
    Validator.register('telephone', function(val) {
      return val.match(/^\d{3}-\d{3}-\d{4}$/);
    });

    var validator = new Validator();
    expect(validator.getRule('telephone').validate).to.be.a.function;
  });

  it('should pass the custom telephone rule registration', function() {
    Validator.register('telephone', function(val) {
      return val.match(/^\d{3}-\d{3}-\d{4}$/);
    });

    var validator = new Validator({
      phone: '213-454-9988'
    }, {
      phone: 'telephone'
    });
    expect(validator.passes()).to.be.true;
  });

  it('should pass the custom greater_than rule registration with custom replacements', function() {
    Validator.register(
      'greater_than', 
      function(val, req) {
        return val > Number(req);
      },
      function (props) {
        return {
          value: props
        }
      },
      'The :attribute field should be greater than :value.'
    );

    var validator = new Validator({
      age: 22
    }, {
      age: 'greater_than:21'
    });

    expect(validator.passes()).to.be.true;
    expect(validator.fails()).to.be.false;
  });

  it('should fail the custom greater_than rule registration with custom replacements', function() {
    Validator.register(
      'greater_than', 
      function(val, req) {
        return val > Number(req);
      },
      function (props) {
        return {
          value: props
        }
      },
      'The :attribute field should be greater than :value.'
    );

    var validator = new Validator({
      age: 18
    }, {
      age: 'greater_than:21'
    });

    expect(validator.fails()).to.be.true;
    expect(validator.passes()).to.be.false;
    expect(validator.errors.first('age')).to.equal('The age field should be greater than 21.');
  }); 

  it('should fail the custom greater_than rule registration without custom replacements', function() {
    Validator.register(
      'greater_than', 
      function(val, req) {
        return val > Number(req);
      },
      'The :attribute field is not big enough.'
    );

    var validator = new Validator({
      age: 18
    }, {
      age: 'greater_than:21'
    });

    expect(validator.fails()).to.be.true;
    expect(validator.passes()).to.be.false;
    expect(validator.errors.first('age')).to.equal('The age field is not big enough.');
  });

  it('should override custom rules', function() {
    Validator.register('string', function(val) {
      return true;
    });

    var validator = new Validator({
      field: ['not a string']
    }, {
      field: 'string'
    });

    expect(validator.passes()).to.be.true;
    expect(validator.fails()).to.be.false;
    Validator.register('string', function(val) {
      return typeof val === 'string';
    }, 'The :attribute must be a string.');
  });
});
