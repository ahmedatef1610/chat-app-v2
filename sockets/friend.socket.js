const UserDb = require("../models/user.db");
/************************************************************/
module.exports = (io) => {
  io.on("connection", (socket) => {
    //1
    socket.on("sendFriendRequest", (data) => {
      UserDb.sendFriendRequest(data)
        .then(() => {
          socket.emit("requestSent");
          io.to(data.friendId).emit("newFriendRequest", {
            name: data.myName,
            id: data.myId,
          });
        })
        .catch((err) => {
          socket.emit("requestFailed");
        });
    });
    //2
    socket.on("getOnlineFriends", (id) => {
      UserDb.getFriends(id)
        .then((friends) => {
          let onlineFriends = friends.filter((friend) => io.onlineUsers[friend.id]);
          socket.emit("onlineFriends", onlineFriends);
        })
        .catch((err) => {
          socket.emit("requestFailed");
        });
    });
    //3
  });
};
