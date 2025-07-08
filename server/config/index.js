require('dotenv').config();

const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
const PORT = process.env.PORT || 5000;

module.exports = { CLIENT_URL, PORT };
