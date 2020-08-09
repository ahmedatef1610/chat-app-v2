const mongoose = require("mongoose");
/***********************************************************************/
const messageSchema = mongoose.Schema(
  {
    chat: { type: mongoose.Schema.Types.ObjectId, ref: "chat" },
    content: { type: String },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  },
  {
    timestamps: true,
  }
);
/***********************************************************************/
module.exports = mongoose.model("message", messageSchema);
