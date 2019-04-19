module.exports = {
  configure: function(app, mongo, url, ObjectID, assert, dbb) {
    var user_module = require('../modules/user_module')(mongo, url, ObjectID, assert, dbb);

    //Start of Register User
    app.post('/Register_User', function(req, res) {
      try {
        if(req.body.hasOwnProperty("username") && req.body.hasOwnProperty("password") && req.body.hasOwnProperty("email")) {
          var new_user = {
            username: req.body.username,
            password: req.body.password,
            email: req.body.email
          }
          user_module.register_user(new_user, function(result, error, message) {
            if (error) {
              res.json({ status: false, message: message });
            }
            else {
              res.json({ status: true, message: message, result: new_user });
            }
          })
        }
        else {
          if(req.body.hasOwnProperty("username") == false) {
            res.json({ status: false, message: "username parameter missing" });
          }
          else if(req.body.hasOwnProperty("password") == false){
            res.json({ status: false, message: "password parameter missing" });
          }
          else if(req.body.hasOwnProperty("email") == false){
            res.json({ status: false, message: "email parameter missing" });
          }
        }
      } catch (err) {
        console.log("error occurred: "+ err);
        res.json({ status: false, message: err });
      }
    });

    //End of Register User

    //Start of Login User
    app.post('/Login_User', function(req, res) {
      try {
        if(req.body.hasOwnProperty("password") && req.body.hasOwnProperty("email")) {
          user_module.login_user(req.body.password, req.body.email, function(type, error, message) {
            if (type) {
              res.json({ status: true, message: message, result: type });
            }
            else {
              res.json({ status: false, message: "Log in Failed" });
            }
          })
        }
        else {
          if(req.body.hasOwnProperty("password") == false){
            res.json({ status: false, message: "password parameter missing" });
          }
          else if(req.body.hasOwnProperty("email") == false){
            res.json({ status: false, message: "email parameter missing" });
          }
        }
      } catch (err) {
        console.log("error occurred: "+ err);
        res.json({ status: false, message: err });
      }
    });

    //End of Login User
  }
}