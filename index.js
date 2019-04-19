//Require
 var express = require('express');
 var app = express();
 var mongo = require('mongodb');
 var assert = require('assert');
 var bodyParser = require('body-parser');
 var cors = require('cors');
 var ObjectID = require('mongodb').ObjectID;


 //Setting Port
 app.set('port', (process.env.PORT || 8000));
 app.use(cors());
 app.use(bodyParser.json());
 app.use(bodyParser.urlencoded({ extended: true }));

 //Listen to Port
app.listen(app.get('port'), function() {
  console.log("Node app is running on port", app.get('port'));
});

//Welcome API 
app.get('/', function(req, res) {
  res.send("Welcome to Chatting App!");
});


//LOCAL
var url = "mongodb://localhost:27017/chat_app";


//Database Collections
var dbb = {
  USER_DETAILS: "User_Details",
  CHAT_DETAILS: "Chat_Details"
}

//Require Routes
var userroute = require('./routes/user_route');
var chatroute = require('./routes/chat_route');


//Configure Routes
userroute.configure(app, mongo, url, ObjectID, assert, dbb);
chatroute.configure(app, mongo, url, ObjectID, assert, dbb);