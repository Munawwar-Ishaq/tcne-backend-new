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
const port = process.env.PORT || 9898; // Match with mobile app's baseURL port

// Middleware
app.use(cors({
  origin: '*', // Allow all origins for testing (replace with specific origin in production)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));
app.use(express.json());

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: '*', // Allow all origins for testing
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
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

    await sequelize.sync({ alter: false });
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

app.get('/', (req, res) => {
  res.send('Welcome to TechnoCity Billing Backend!');
});

// Routes
app.use('/api/v1', AuthRoutes);
app.use('/api/v1', UserRoutes);

// Log all incoming requests for debugging
app.use((req, res, next) => {
  console.log(`Incoming Request: ${req.method} ${req.url}`);
  next();
});

// Start server and bind to all network interfaces
server.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
  console.log(`Socket.io running on port ${port}`);
  console.log(`Accessible at http://192.168.0.110:${port}`);
});

module.exports = { io };