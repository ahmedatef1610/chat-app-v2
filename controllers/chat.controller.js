const ChatDb = require("../models/chat.db");
const MessageDb = require("../models/message.db");

/*********************************/
// 1 Get "/chat/:id"
exports.getChat = (req, res, next) => {
  let chatId = req.params.id;
  MessageDb.getMessages(chatId).then((messages) => {
    if (messages.length === 0) {
      ChatDb.getChat(chatId).then((chat) => {
        let friendData = chat.users.find(
          (user) => user._id != req.session.userId
        );
        res.render("chat", {
          path: "/profile",
          pageTitle: friendData.username,
          messages: messages,
          friendData: friendData,
          chatId: chatId,
        });
      });
    } else {
      let friendData = messages[0].chat.users.find(
        (user) => user._id != req.session.userId
      );
      res.render("chat", {
        path: "/profile",
        pageTitle: friendData.username,
        messages: messages,
        friendData: friendData,
        chatId: chatId,
      });
    }
  });
};
