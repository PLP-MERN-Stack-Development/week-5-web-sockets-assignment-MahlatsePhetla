const { Server } = require('socket.io');
const { CLIENT_URL } = require('../config');
const { chatController } = require('../controllers/chatController');

function setupSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: CLIENT_URL,
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    chatController(io, socket);
  });
}

module.exports = { setupSocket };
