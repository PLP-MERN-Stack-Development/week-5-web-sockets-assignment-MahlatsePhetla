
require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const User = require("./models/User");
const Message = require("./models/Message");


connectDB();

const app = express();
const server = http.createServer(app);


const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});


app.use(cors());
app.use(express.json());


app.use("/api/auth", authRoutes);


app.post("/api/test/message", async (req, res) => {
  try {
    const { userEmail, content, room } = req.body;
    const user = await User.findOne({ email: userEmail });
    if (!user) return res.status(404).json({ message: "User not found" });

    const newMsg = await Message.create({
      sender: user._id,
      content,
      room: room || "global",
    });

    const populatedMsg = await newMsg.populate("sender", "username email");
    res.status(201).json(populatedMsg);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error saving message" });
  }
});


const messageRoutes = require("./routes/messageRoutes");
app.use("/api/messages", messageRoutes);


require("./socket/chat")(io);


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});
