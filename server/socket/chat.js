
const Message = require("../models/Message");

module.exports = function (io) {
  
  const onlineUsers = new Map();

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    
    socket.on("userOnline", (userId) => {
      onlineUsers.set(userId, socket.id);
      console.log(`User ${userId} is online`);

      
      io.emit("onlineUsers", Array.from(onlineUsers.keys()));
    });

    
    socket.on("joinRoom", (room) => {
      socket.join(room);
      console.log(`Socket ${socket.id} joined room: ${room}`);
    });

    
    socket.on("sendMessage", async ({ senderId, content, room = "global" }) => {
      try {
        
        const newMsg = await Message.create({
          sender: senderId,
          content,
          room,
        });

        const populated = await newMsg.populate("sender", "username email");

        
        io.to(room).emit("receiveMessage", populated);
      } catch (err) {
        console.error("Message error:", err.message);
      }
    });

    
    socket.on("typing", ({ room, userId, isTyping }) => {
      
      socket.to(room).emit("typing", { userId, isTyping });
    });

    
    socket.on("disconnect", () => {
      console.log(" User disconnected:", socket.id);

      
      for (const [userId, sockId] of onlineUsers.entries()) {
        if (sockId === socket.id) {
          onlineUsers.delete(userId);
          console.log(`User ${userId} went offline`);
          
          io.emit("onlineUsers", Array.from(onlineUsers.keys()));
          break;
        }
      }
    });
  });
};
