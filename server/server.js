

const express = require('express');
const http = require('http');
const cors = require('cors');
const path = require('path');
const { setupSocket } = require('./sockets/socket');
const { CLIENT_URL, PORT } = require('./config');
const { users, messages } = require('./controllers/chatController');

const app = express();
const server = http.createServer(app);

app.use(cors({
  origin: CLIENT_URL,
  credentials: true,
}));

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/messages', (req, res) => {
  res.json(messages);
});

app.get('/api/users', (req, res) => {
  res.json(Object.values(users));
});

app.get('/', (req, res) => {
  res.send('Socket.io Chat Server is running');
});

setupSocket(server);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
