module.exports = function(mongo, url, ObjectID, assert, dbb) {
  var chat_module = {


  //Start of Add conversation

  add_conversation: function(chat, callBack) {
    try {
      mongo.connect(url, {useNewUrlParser: true}, function(err, db) {
        assert.equal(null, err);
        db.db().collection(dbb.CHAT_DETAILS).insertOne(chat, function(err, result) {
          if(err) {
            callBack(null, true, "Error Occurred");
          }
          else {
            callBack(result, false, "Chat Started");
          }
          db.close();
        })
      })
    } catch (e) {
      callBack(null, true, e);
    }
  },

  //End of Add conversation

  //Start of Chat Exists

  chat_exists: function (users_id, chat_with_id, callBack) {
    try {
      exists = false;
      mongo.connect(url, {useNewUrlParser: true}, function (err, db) {
        assert.equal(null, err);
        var cursor = db.db().collection(dbb.CHAT_DETAILS).find({ "users_id": users_id, "chat_with_id": chat_with_id});
        cursor.forEach(function (doc, err) {
          assert.equal(null, err);
          console.log(doc);
          exists = true;
        }, function () {
          if(exists) {
            callBack(exists, true, "Chat Found");
          } else {
            callBack(exists, false, "");
          }
          db.close();
        })
      })
    } catch (e) {
      callBack(exists, true, e )
    }
  },

  //End of Chat Exists


  //Continue Chat
  continue_chat: function(users_id, chat_with_id, chat_text, callBack) {
    try {
      chats =[];
      mongo.connect(url, {useNewUrlParser: true}, function(err, db) {
        assert.equal(null, err);
        var cursor = db.db().collection(dbb.CHAT_DETAILS).update({"users_id": users_id, "chat_with_id": chat_with_id },
        {
          $push: {
            chats: {
              senders_id: users_id,
              chat_text: chat_text,
              datetime: new Date() }
          }
        }, { upsert: false }, function (err, result) {
          if(err) {
            callBack(null, true, err);
          }
          else {
            var cursor = db.db().collection(dbb.CHAT_DETAILS).find({"users_id": users_id, "chat_with_id": chat_with_id });
            cursor.forEach(function (doc, err) {
                assert.equal(null, err);
                if (err) {
                    callBack(null, true, err);
                } else {
                  chats.push(doc);
                  chats = doc.chats;
                }
            }, function() {
                if(chats.length == 0) {
                    callBack(null, true, "No Chats Found");
                } else {
                    callBack(chats, false, "New Chat Added");
                }
                db.close();           
            })
          }
        })    
      });
    } catch (error) {
      callBack (null, true, error);
    }
  },

  //Continue Chat


  //Reply Chat

  reply_chat: function(users_id, senders_id, chat_text, callBack) {
    try {
      chats =[];
      mongo.connect(url, {useNewUrlParser: true}, function(err, db) {
        assert.equal(null, err);
        var cursor = db.db().collection(dbb.CHAT_DETAILS).update({"users_id": senders_id, "chat_with_id": users_id },
        {
          $push: {
            chats: {
              senders_id: users_id,
              chat_text: chat_text,
              datetime: new Date() }
          }
        }, { upsert: false }, function (err, result) {
          if(err) {
            callBack(null, true, err);
          }
          else {
            var cursor = db.db().collection(dbb.CHAT_DETAILS).find({"users_id": senders_id, "chat_with_id": users_id });
            cursor.forEach(function (doc, err) {
                assert.equal(null, err);
                if (err) {
                    callBack(null, true, err);
                } else {
                  chats.push(doc);
                  chats = doc.chats;
                }
            }, function() {
                if(chats.length == 0) {
                    callBack(null, true, "No Chats Found");
                } else {
                    callBack(chats, false, "New Chat Added");
                }
                db.close();           
            })
          }
        })    
      });
    } catch (error) {
      callBack (null, true, error);
    }
  },

  //End of Reply Chat

  //Get Chat
  get_chat: function(users_id, chat_with_id, callBack) {
    try {
      chats =[];
        mongo.connect(url, {useNewUrlParser: true}, function (err, db) {
            assert.equal(null , err);
            var cursor = db.db().collection(dbb.CHAT_DETAILS).find({ "users_id": users_id, "chat_with_id": chat_with_id });
            cursor.forEach(function (doc, err) {
                assert.equal(null, err);
                if (err) {
                    callBack(null, true, err);
                } else {
                  chats.push(doc);
                }
            }, function() {
                if(chats.length == 0) {
                    callBack(null, true, "No Chats Found");
                } else {
                    callBack(chats, false, "Chats Found");
                }
                db.close();
            })
        })
    } catch (e) {
        callBack(null, true, e);
    }
  },


  //End of Get Chat


  }
  return chat_module;
}