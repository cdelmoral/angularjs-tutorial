var mongoose = require('mongoose');

before(function(done) {
  mongoose.connect("mongodb://localhost/angularjs_tutorial_test", function(err) {
    done(err);
  });
});

afterEach(function(done) {
  mongoose.connection.db.dropDatabase(function(err) {
    done(err);
  });
});
