

const express = require("express");
const router = express.Router();
const Message = require("../models/Message");


router.get("/:room", async (req, res) => {
  try {
    const { room } = req.params;

    const messages = await Message.find({ room })
      .populate("sender", "username email")
      .sort({ createdAt: 1 }); 

    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load messages" });
  }
});



module.exports = router;
