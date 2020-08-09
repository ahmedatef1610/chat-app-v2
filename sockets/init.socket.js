const UserDb = require("../models/user.db");
/************************************************************/
module.exports = (io) => {
  io.on("connection", (socket) => {
    //1
    socket.on("joinNotificationsRoom", (id) => {
      socket.join(id);
      console.log("joined", id);
    });
    //2
    socket.on("goOnline", (id) => {
      io.onlineUsers[id] = true;
      socket.on("disconnect", () => {
        io.onlineUsers[id] = false;
        socket.leave(id);
      });
    });
    //3

  });
};
