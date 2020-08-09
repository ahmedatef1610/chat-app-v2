const UserDb = require("../models/user.db");
/*********************************/
// 1 Post "/friend/add"
// exports.add = (req, res, next) => {
    // UserDb.sendFriendRequest(req.body)
    //   .then(() => {
    //     res.redirect("/profile/" + req.body.friendId);
    //   })
    //   .catch((err) => {
    //     next(err);
    //   });
//   };
// 2 Post "/friend/cancel"
exports.cancel = (req, res, next) => {
  UserDb.cancelFriendRequest(req.body)
    .then(() => {
      res.redirect("/profile/" + req.body.friendId);
    })
    .catch((err) => {
      next(err);
    });
};
// 3 Post "/friend/accept"
exports.accept = (req, res, next) => {
  UserDb.acceptFriendRequest(req.body)
    .then(() => {
      res.redirect("/profile/" + req.body.friendId);
    })
    .catch((err) => {
      next(err);
    });
};
// 4 Post "/friend/reject"
exports.reject = (req, res, next) => {
  UserDb.rejectFriendRequest(req.body)
    .then(() => {
      res.redirect("/profile/" + req.body.friendId);
    })
    .catch((err) => {
      next(err);
    });
};
// 5 Post "/friend/delete"
exports.delete = (req, res, next) => {
  UserDb.deleteFriend(req.body)
    .then(() => {
      res.redirect("/profile/" + req.body.friendId);
    })
    .catch((err) => {
      next(err);
    });
};
