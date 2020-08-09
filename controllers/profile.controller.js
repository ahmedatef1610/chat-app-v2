const UserDb = require("../models/user.db");
/*********************************/
// 1 Get "/profile/"
exports.redirect = (req, res, next) => {
  res.redirect("/profile/" + req.session.userId);
};
// 2 Get "/profile/:id"
exports.getProfile = (req, res, next) => {
  let id = req.params.id;
  if (!id) return res.redirect("/profile/" + req.session.userId);
  UserDb.getUserData(id)
    .then((data) => {
      //console.log(data);
      res.render("profile", {
        path: "/profile",
        pageTitle: "Profile - " + data.username,
        username: data.username,
        userImage: data.image,
        isOwner: id === req.session.userId,
        isFriends: data.friends.find((friend) => friend.id === req.session.userId),
        isRequestSent: data.friendRequests.find((friend) => friend.id === req.session.userId),
        isRequestRecieved: data.sentRequests.find((friend) => friend.id === req.session.userId),
        myId: req.session.userId,
        myName: req.session.name,
        myImage: req.session.image,
        friendId: data._id,
        friendRequests: req.friendRequests
      });
    })
    .catch((err) => {
      next(err);
    });
};
