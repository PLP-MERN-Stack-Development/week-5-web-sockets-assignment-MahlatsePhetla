
const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    room: { type: String, default: "global" }, 
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, 
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], 
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);
