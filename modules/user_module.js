module.exports = function(mongo, url, ObjectID, assert, dbb) {
  var user_module = {


    //Start of Register User
    register_user: function(new_user, callBack) {
      try {
        mongo.connect(url, {useNewUrlParser: true}, function(err, db) {
          assert.equal(null, err);
          db.db().collection(dbb.USER_DETAILS).insertOne(new_user, function(err, result) {
            if(err) {
              callBack(null, true, "Error Occurred");
            }
            else {
              callBack(result, false, "User Registered Successfully");
            }
            db.close();
          })
        })
      } catch (e) {
        callBack(null, true, e);
      }
    },

    //End of Register User

    //Start of Login User
    login_user: function(password, email, callBack) {
      try {
        var type = false;
        mongo.connect(url, function (err, db) {
        assert.equal(null, err);
        var cursor = db.db().collection(dbb.USER_DETAILS).find({ "email": email, "password": password });
        cursor.forEach(function (doc, err) {
          assert.equal(null, err);
          if (err) {
            callBack(type, true);
          } else {
            //console.log(doc);
            type = { username: doc.username , id: doc._id };
          }
        }, function () {
          callBack(type, false, "Log In Successful");
          db.close();
        })

        })
      } catch (e) {
        callBack(type, false);
      }
    },
    //End of Login User
  }
  return user_module;
}