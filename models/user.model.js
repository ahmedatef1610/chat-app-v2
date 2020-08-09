const mongoose = require("mongoose");
/***********************************************************************/
const userSchema = new mongoose.Schema(
  {
    username: { type: String, require: true },
    email: { type: String, require: true },
    password: { type: String, require: true },
    image: { type: String, default: "default-user-image.png" },
    isOnline: { type: Boolean, default: false },
    friends: {
      type: [{ name: String, image: String, id: String, chatId: String }],
      default: [],
    },
    friendRequests: {
      type: [{ name: String, id: String }],
      default: [],
    },
    sentRequests: {
      type: [{ name: String, id: String }],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);
/***********************************************************************/
module.exports = mongoose.model("user", userSchema);
