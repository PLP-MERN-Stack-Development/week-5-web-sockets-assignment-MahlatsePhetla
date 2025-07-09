require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const messageRoutes = require("./routes/messageRoutes");

// Connect to MongoDB
connectDB();

const app = express();
const server = http.createServer(app);

// CORS options for your React frontend (Vite default port 5173)
const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// Use routes (no inline route handlers that duplicate routes)
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// Initialize Socket.IO server
const io = new Server(server, {
  cors: {
    origin: corsOptions.origin,
    credentials: true,
  },
});

const onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Listen for user login or join event to track username
  socket.on("user_connected", (username) => {
    onlineUsers.set(socket.id, username);
    io.emit("online_users", Array.from(onlineUsers.values()));
  });

  socket.on("send_message", (message) => {
    // Broadcast message to all users
    io.emit("receive_message", message);
  });

  socket.on("typing", (username) => {
    socket.broadcast.emit("user_typing", username);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    onlineUsers.delete(socket.id);
    io.emit("online_users", Array.from(onlineUsers.values()));
  });
});



// Start server
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});
