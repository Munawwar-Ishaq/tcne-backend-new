require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const AuthRoutes = require('./routes/AuthRoutes');
const UserRoutes = require('./routes/UserRoutes');
const sequelize = require('./config/DB_Connection');
const User = require('./models/UsersModel'); // User model import
const Role = require('./models/RolesModel'); // Role model import

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// Store io instance in app for use in routes
app.set('io', io);

// Socket.io connection
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });

  socket.on('message', (msg) => {
    console.log('Message received:', msg);
    io.emit('message', `${socket.id}: ${msg}`); // Broadcast to all clients
  });
});

// DB Connection and Sync
(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ MySql DB Connected');

    await Role.sync({ alter: true }); 
    await User.sync({ alter: true }); 
    console.log('✅ Tables synced');
  } catch (err) {
    console.error('❌ DB Error:', err);
    process.exit(1); // Server crash hone pe exit karo taake nodemon restart kare
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