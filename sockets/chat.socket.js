const MessageDb = require("../models/message.db");
/************************************************************/
module.exports = (io) => {
  io.on("connection", (socket) => {
    // 1
    socket.on("joinChat", chatId => {
        socket.join(chatId);
    });
    // 2
    socket.on("sendMessage", (msg, cb) => {
        MessageDb.newMessage(msg).then(() => {
            io.to(msg.chat).emit("newMessage", msg);
            cb();
        });
    });
    // 3
    socket.on("requestPeerId", chatId => {
        socket.broadcast.to(chatId).emit("getPeerId");
    });
    // 4
    socket.on("sendPeerId", data => {
        socket.broadcast.to(data.chatId).emit("recievePeerId", data.peerId);
    });

  });
};
