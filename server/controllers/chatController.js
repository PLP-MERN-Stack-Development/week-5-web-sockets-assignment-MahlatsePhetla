
const { isValidUsername } = require('../utils/validators');
const User = require('../models/User');
const Message = require('../models/Message');

const users = {};
const messages = []; 
const typingUsers = {};

const GENERAL_ROOM = 'general';

function chatController(io, socket) {
  console.log(`🔌 User connected: ${socket.id}`);


  socket.on('user_join', (username) => {
    if (!isValidUsername(username)) {
      socket.emit('error_message', { message: 'Invalid username' });
      return;
    }

    const usernameTaken = Object.values(users).some(
      (user) => user.username === username
    );

    if (usernameTaken) {
      socket.emit('error_message', { message: 'Username already taken' });
      return;
    }

    const user = new User(socket.id, username);
    users[socket.id] = user;
    socket.join(GENERAL_ROOM); 

    
    io.to(GENERAL_ROOM).emit('user_list', Object.values(users));
    io.to(GENERAL_ROOM).emit('user_joined', user);
    console.log(`${username} joined #general`);
  });

  
  socket.on('send_message', (messageData) => {
    const sender = users[socket.id]?.username || 'Anonymous';
    const message = new Message({
      ...messageData,
      sender,
      senderId: socket.id,
    });

    messages.push(message);
    if (messages.length > 100) messages.shift();

    io.to(GENERAL_ROOM).emit('receive_message', message);
  });


  socket.on('typing', (isTyping) => {
    const user = users[socket.id];
    if (!user) return;

    if (isTyping) {
      typingUsers[socket.id] = user.username;
    } else {
      delete typingUsers[socket.id];
    }

    io.to(GENERAL_ROOM).emit('typing_users', Object.values(typingUsers));
  });


  socket.on('private_message', ({ to, message }) => {
    const sender = users[socket.id]?.username || 'Anonymous';
    const privateMsg = new Message({
      sender,
      senderId: socket.id,
      message,
      isPrivate: true,
    });

    socket.to(to).emit('private_message', privateMsg);
    socket.emit('private_message', privateMsg); 
  });

  
  socket.on('disconnect', () => {
    const user = users[socket.id];
    if (user) {
      io.to(GENERAL_ROOM).emit('user_left', { username: user.username, id: socket.id });
      console.log(` ${user.username} left`);
    }

    delete users[socket.id];
    delete typingUsers[socket.id];

    io.to(GENERAL_ROOM).emit('user_list', Object.values(users));
    io.to(GENERAL_ROOM).emit('typing_users', Object.values(typingUsers));
  });
}

module.exports = {
  chatController,
  users,
  messages,
  typingUsers,
};
