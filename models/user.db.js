const mongoose = require("mongoose");
const { mongoURL } = require("../config/keys");
const dataDb = { useNewUrlParser: true, useUnifiedTopology: true };
/***********************/
const UserModel = require("./user.model");
const ChatDb = require("./chat.db");
/***********************/
const bcrypt = require("bcrypt");
/***********************************************************************/
// 1
exports.createNewUser = (username, email, password) => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(mongoURL, dataDb)
      .then(() => {
        return UserModel.findOne({ email });
      })
      .then((user) => {
        if (user) {
          mongoose.disconnect();
          reject("email is used");
        } else {
          return bcrypt.hash(password, 10);
        }
      })
      .then((hashedPassword) => {
        let user = new UserModel({ username, password: hashedPassword, email });
        return user.save();
      })
      .then(() => {
        mongoose.disconnect();
        resolve("user is created");
      })
      .catch((err) => {
        mongoose.disconnect();
        reject(err);
      });
  });
};
// 2
exports.login = (email, password) => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(mongoURL, dataDb)
      .then(() => {
        return UserModel.findOne({ email });
      })
      .then((user) => {
        if (!user) {
          mongoose.disconnect();
          reject("email not found");
        } else {
          return bcrypt.compare(password, user.password).then((same) => {
            if (!same) {
              mongoose.disconnect();
              reject("password is incorrect");
            } else {
              mongoose.disconnect();
              resolve(user);
            }
          });
        }
      })
      .catch((err) => {
        mongoose.disconnect();
        reject(err);
      });
  });
};
//3 profile
exports.getUserData = (id) => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(mongoURL, dataDb)
      .then(() => {
        return UserModel.findById(id);
      })
      .then((data) => {
        mongoose.disconnect();
        resolve(data);
      })
      .catch((err) => {
        mongoose.disconnect();
        reject(err);
      });
  });
};
//4 friend add
exports.sendFriendRequest = async (data) => {
  // add my data to friend friendRequests
  // add friend data to my sentRequests
  try {
    await mongoose.connect(mongoURL, dataDb);
    await Promise.all([
      UserModel.updateOne(
        { _id: data.friendId },
        { $push: { friendRequests: { name: data.myName, id: data.myId } } }
      ),
      UserModel.updateOne(
        { _id: data.myId },
        {
          $push: { sentRequests: { name: data.friendName, id: data.friendId } },
        }
      ),
    ]);
    mongoose.disconnect();
    return;
  } catch (error) {
    mongoose.disconnect();
    throw new Error(error);
  }
};
//5 friend cancel
exports.cancelFriendRequest = async (data) => {
  // remove me from friend friendRequests
  // remove friend from my sentRequests
  try {
    await mongoose.connect(mongoURL, dataDb);
    await Promise.all([
      UserModel.updateOne(
        { _id: data.friendId },
        { $pull: { friendRequests: { id: data.myId } } }
      ),
      UserModel.updateOne(
        { _id: data.myId },
        { $pull: { sentRequests: { id: data.friendId } } }
      ),
    ]);
    mongoose.disconnect();
    return;
  } catch (error) {
    mongoose.disconnect();
    throw new Error(error);
  }
};
//6 friend accept
exports.acceptFriendRequest = async (data) => {
  try {
    await mongoose.connect(mongoURL, dataDb);
    let chatDoc = await ChatDb.setChat(data.myId, data.friendId);
    await Promise.all([
      UserModel.updateOne(
        { _id: data.friendId },
        { $pull: { sentRequests: { id: data.myId } } }
      ),
      UserModel.updateOne(
        { _id: data.myId },
        { $pull: { friendRequests: { id: data.friendId } } }
      ),
      UserModel.updateOne(
        { _id: data.friendId },
        {
          $push: {
            friends: {
              name: data.myName,
              id: data.myId,
              image: data.myImage,
              chatId: chatDoc._id,
            },
          },
        }
      ),
      UserModel.updateOne(
        { _id: data.myId },
        {
          $push: {
            friends: {
              name: data.friendName,
              id: data.friendId,
              image: data.friendImage,
              chatId: chatDoc._id,
            },
          },
        }
      ),
    ]);
    mongoose.disconnect();
    return;
  } catch (err) {
    mongoose.disconnect();
    throw new Error(err);
  }
};
//7 friend reject
exports.rejectFriendRequest = async (data) => {
  try {
    await mongoose.connect(mongoURL, dataDb);
    await Promise.all([
      UserModel.updateOne(
        { _id: data.friendId },
        {
          $pull: { sentRequests: { id: data.myId } },
        }
      ),
      UserModel.updateOne(
        { _id: data.myId },
        {
          $pull: {
            friendRequests: { id: data.friendId },
          },
        }
      ),
    ]);
    mongoose.disconnect();
    return;
  } catch (err) {
    mongoose.disconnect();
    throw new Error(err);
  }
};
//8 friend delete
exports.deleteFriend = async (data) => {
  try {
    await mongoose.connect(mongoURL, dataDb);
    await Promise.all([
      UserModel.updateOne(
        { _id: data.friendId },
        {
          $pull: { friends: { id: data.myId } },
        }
      ),
      UserModel.updateOne(
        { _id: data.myId },
        {
          $pull: {
            friends: { id: data.friendId },
          },
        }
      ),
    ]);
    mongoose.disconnect();
    return;
  } catch (err) {
    mongoose.disconnect();
    throw new Error(err);
  }
};
//9
exports.getFriendRequests = async (id) => {
  try {
    await mongoose.connect(mongoURL, dataDb);
    let data = await UserModel.findById(id, { friendRequests: true });
    mongoose.disconnect();
    return data.friendRequests;
  } catch (error) {
    mongoose.disconnect();
    throw new Error(error);
  }
};
//10
exports.getFriends = async (id) => {
  try {
    await mongoose.connect(mongoURL, dataDb);
    let data = await UserModel.findById(id, { friends: true });
    mongoose.disconnect();
    return data.friends;
  } catch (error) {
    mongoose.disconnect();
    throw new Error(error);
  }
};
/***********************************************************************/
