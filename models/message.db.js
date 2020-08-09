const mongoose = require("mongoose");
const { mongoURL } = require("../config/keys");
const dataDb = { useNewUrlParser: true, useUnifiedTopology: true };
/***********************/
const MessageModel = require("./message.model");
/***********************************************************************/
// 1
exports.getMessages = async (chatId) => {
  try {
    await mongoose.connect(mongoURL, dataDb);
    let messages = await MessageModel.find({ chat: chatId }, {}, {
      sort: {
        createdAt: 1,
      },
    }).populate({
      path: "chat", // field
      model: "chat", // model
      populate: {
        path: "users",
        model: "user",
        select: "username image",
      },
    });
    mongoose.disconnect();
    return messages;
  } catch (error) {
    mongoose.disconnect();
    throw new Error(error);
  }
};
// 2
exports.newMessage = async (msg) => {
  try {
    await mongoose.connect(mongoURL, dataDb);
    let newMsg = new MessageModel(msg);
    await newMsg.save();
    mongoose.disconnect;
    return;
  } catch (error) {
    mongoose.disconnect();
    throw new Error(error);
  }
};
