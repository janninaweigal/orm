var should   = require('should');
var helper   = require('../support/spec_helper');

describe("Model.existsAsync()", function() {
  var db     = null;
  var Person = null;
  var good_id, bad_id;

  var setup = function () {
    return function (done) {
      Person = db.define("person", {
        name   : String
      });

      return helper.dropSync(Person, function () {
        Person.create([{
          name: "Jeremy Doe"
        }, {
          name: "John Doe"
        }, {
          name: "Jane Doe"
        }], function (err, people) {
          good_id = people[0][Person.id];

          if (typeof good_id == "number") {
            // numeric ID
            bad_id = good_id * 100;
          } else {
            // string ID, keep same length..
            bad_id = good_id.split('').reverse().join('');
          }

          return done();
        });
      });
    };
  };

  before(function (done) {
    helper.connect(function (connection) {
      db = connection;

      return done();
    });
  });

  after(function () {
    return db.close();
  });

  describe("with an id", function () {
    before(setup());

    it("should return true if found", function () {
      return Person.existsAsync(good_id)
        .then(function (exists) {
          exists.should.be.true();
        });
    });

    it("should return false if not found", function () {
      return Person.existsAsync(bad_id)
        .then(function (exists) {
          exists.should.be.false();
        });
    });
  });

  describe("with a list of ids", function () {
    before(setup());

    it("should return true if found", function () {
      return Person.existsAsync([ good_id ])
        .then(function (exists) {
          exists.should.be.true();
        });
    });

    it("should return false if not found", function () {
      return Person.existsAsync([ bad_id ])
        .then(function (exists) {
          exists.should.be.false();
        });
    });
  });

  describe("with a conditions object", function () {
    before(setup());

    it("should return true if found", function () {
      return Person.existsAsync({ name: "John Doe" })
        .then(function (exists) {
          exists.should.be.true();
        });
    });

    it("should return false if not found", function () {
      return Person.existsAsync({ name: "Jack Doe" })
        .then(function (exists) {
          exists.should.be.false();
        });
    });
  });
});
