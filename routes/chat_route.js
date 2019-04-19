module.exports = {
  configure: function(app, mongo, url, ObjectID, assert, dbb) {
    var user_module = require('../modules/user_module')(mongo, url, ObjectID, assert, dbb);
    var chat_module = require('../modules/chat_module')(mongo, url, ObjectID, assert, dbb);

    //Start of Chat with user of choice
    app.post('/Start_Chat', function(req, res) {
      try {
        if(req.body.hasOwnProperty("users_id") && req.body.hasOwnProperty("chat_with_id") && req.body.hasOwnProperty("chat_text")) {
          chat_module.chat_exists(req.body.users_id, req.body.chat_with_id, function(result, exists, message) {
            if (!exists) {
              var chat = {
                users_id: req.body.users_id,
                chat_with_id: req.body.chat_with_id,
                chats: [{
                  senders_id: req.body.users_id,
                  chat_text: req.body.chat_text,
                  datetime: new Date() }],
              }
              chat_module.add_conversation(chat, function(result, error, message) {
                if (error) {
                  res.json({ status: false, message: message });
                }
                else {
                  res.json({ status: true, message: message, result: { "chatid": result.insertedId, "chat": chat.chats }});
                }
              })
            }
            else {
              chat_module.continue_chat(req.body.users_id, req.body.chat_with_id, req.body.chat_text, function(result, error, message) {
                if (error) {
                  res.json({ status: false, message: message });
                }
                else {
                  res.json({ status: true, message: message, result: result });
                }
              })
            }          
          })     
        }
        else {
          if(req.body.hasOwnProperty("users_id") == false) {
            res.json({ status: false, message: "users_id parameter missing" });
          }
          else if(req.body.hasOwnProperty("chat_with_id") == false){
            res.json({ status: false, message: "chat_with_id parameter missing" });
          }
          else if(req.body.hasOwnProperty("chat_text") == false){
            res.json({ status: false, message: "chat_text parameter missing" });
          }
        }
      } catch (err) {
        console.log("error occurred: "+ err);
        res.json({ status: false, message: err });
      }
    });

    //End of Chat with user of choice


    //Reply to Chat

    app.post('/Reply_Chat', function(req, res) {
      try {
        if(req.body.hasOwnProperty("users_id") && req.body.hasOwnProperty("senders_id") && req.body.hasOwnProperty("chat_text")) {
          chat_module.reply_chat(req.body.users_id, req.body.senders_id, req.body.chat_text, function(result, error, message) {
            if (error) {
              res.json({ status: false, message: message });
            }
            else {
              res.json({ status: true, message: message, result: result });
            }
          })     
        }
        else {
          if(req.body.hasOwnProperty("users_id") == false) {
            res.json({ status: false, message: "users_id parameter missing" });
          }
          else if(req.body.hasOwnProperty("senders_id") == false){
            res.json({ status: false, message: "senders_id parameter missing" });
          }
          else if(req.body.hasOwnProperty("chat_text") == false){
            res.json({ status: false, message: "chat_text parameter missing" });
          }
        }
      } catch (err) {
        console.log("error occurred: "+ err);
        res.json({ status: false, message: err });
      }
    });

    //End of Reply to Chat 


    //Start of Show Chats

    app.post('/Get_Chats', function(req,res) {
      if (req.body.hasOwnProperty("users_id") && req.body.hasOwnProperty("chat_with_id")) {
        chat_module.get_chat(req.body.users_id, req.body.chat_with_id, function (result, error, message) {
          if (error) {
            res.json({ status: false, message: message });
          }
          else {
            res.json({ status: true, message: message, result: result });
          }
        })
      }
      else {
        if(req.body.hasOwnProperty("users_id") == false) {
          res.json({ status: false, message: "users_id parameter missing" });
        }
        else if(req.body.hasOwnProperty("chat_with_id") == false){
          res.json({ status: false, message: "chat_with_id parameter missing" });
        }
      }
    });
    //End of Show Chats
  }
}