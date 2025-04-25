
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const groupRoutes = require('./routes/groups');
const scheduleRoutes = require('./routes/schedule');
const submissionRoutes = require('./routes/submissions');
const resultsRoutes = require('./routes/results');
const settingsRoutes = require('./routes/settings');
const superAdminRouter = require('./routes/superAdmin');



const app = express();
const PORT = process.env.PORT || 5000;

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});
app.set('io', io);

io.on('connection', socket => {
  console.log('Cliente conectado:', socket.id);
});
// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database connection
const { testConnection } = require('./config/database');

// Create uploads directory if it doesn't exist
const fs = require('fs');
const path = require('path');
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/schedule', scheduleRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/results', resultsRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/leader-requests', require('./routes/leaderRequests'));
app.use('/api/super-admin', superAdminRouter);

// Status route
app.get('/api/status', async (req, res) => {
  const dbConnected = await testConnection();
  res.json({
    status: 'ok',
    db_connected: dbConnected,
    timestamp: new Date()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);

  testConnection();
});

module.exports = app;
