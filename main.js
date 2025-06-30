require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const AuthRoutes = require('./routes/AuthRoutes');
const UserRoutes = require('./routes/UserRoutes');
const sequelize = require('./config/DB_Connection');
const User = require('./models/UsersModel');
const Role = require('./models/RolesModel');
const Otp = require('./models/OtpModel');

const app = express();
const port = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ALLOW,
    methods: ['GET', 'POST'],
  },
});

// Store io instance in app for use in routes
app.set('io', io);

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });

  socket.on('message', (msg) => {
    console.log('Message received:', msg);
    io.emit('message', `${socket.id}: ${msg}`);
  });
});

// DB Connection and Sync
(async () => {
  try {
    await sequelize.authenticate();
    console.log(`✅ MySql DB Connected on port ${process.env.DB_PORT || 3307}`);

    await sequelize.sync({ alter: true });
    console.log('✅ Tables synced');
  } catch (err) {
    console.error('❌ DB Error:', err.message);
    console.error('Error Details:', {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      error: err,
    });
    process.exit(1); 
  }
})();

// Routes
app.use('/api/v1', AuthRoutes);
app.use('/api/v1', UserRoutes);

// Start server
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`Socket.io running on port ${port}`);
});

module.exports = { io };