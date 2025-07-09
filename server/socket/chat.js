
const { Server } = require("socket.io");

const onlineUsers = new Map(); 
const userSockets = new Map(); 

const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("✅ Socket connected:", socket.id);

    socket.on("user_connected", (username) => {
      onlineUsers.set(socket.id, username);
      userSockets.set(username, socket.id);

      io.emit("online_users", Array.from(userSockets.keys()));
    });

    socket.on("private_message", ({ to, message, from }) => {
      const targetSocketId = userSockets.get(to);
      if (targetSocketId) {
        io.to(targetSocketId).emit("private_message", { from, message });
        socket.emit("private_message", { from, message }); 
      }
    });

    socket.on("disconnect", () => {
      const username = onlineUsers.get(socket.id);
      userSockets.delete(username);
      onlineUsers.delete(socket.id);

      io.emit("online_users", Array.from(userSockets.keys()));
    });
  });
};

module.exports = initSocket;
