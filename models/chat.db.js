const mongoose = require("mongoose");
const { mongoURL } = require("../config/keys");
const dataDb = { useNewUrlParser: true, useUnifiedTopology: true };
/***********************/
const ChatModel = require("./chat.model");
/***********************************************************************/
// 1 use in user.db.js
exports.setChat = async (uid1, uid2) => {
  try {
    await mongoose.connect(mongoURL, dataDb);
    let newChat = await ChatModel({ users: [uid1, uid2] });
    let chatDoc = await newChat.save();
    return chatDoc;
  } catch (error) {
    throw new Error(error);
  }
};
// 2
exports.getChat = async (chatId) => {
  try {
    await mongoose.connect(mongoURL, dataDb);
    let chat = await ChatModel.findById(chatId).populate("users");
    mongoose.disconnect();
    return chat;
  } catch (error) {
    mongoose.disconnect();
    throw new Error(error);
  }
};
