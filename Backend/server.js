require('dotenv').config();
const mongoose = require('mongoose');
const { createServer } = require('http');
const { Server } = require('socket.io');
const app = require('./app');

const PORT = process.env.PORT || 5000;
const DB_URL = process.env.MONGO_URI;

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  },
});

app.set('io', io);

io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);

  socket.on('join-canteen', (canteenId) => {
    socket.join(`canteen:${canteenId}`);
    console.log(`Socket ${socket.id} joined canteen:${canteenId}`);
  });

  socket.on('leave-canteen', (canteenId) => {
    socket.leave(`canteen:${canteenId}`);
    console.log(`Socket ${socket.id} left canteen:${canteenId}`);
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected:', socket.id);
  });
});

mongoose.connect(DB_URL)
  .then(() => {
    console.log('✅ Successfully connected to MongoDB Database!');

    httpServer.listen(PORT, () => {
      console.log(`🚀 Backend running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.log('❌ Error connecting to MongoDB:');
    console.error(error);
  });
