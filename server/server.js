require('dotenv').config();
const express    = require('express');
const cors       = require('cors');
const http       = require('http');
const { Server } = require('socket.io');
const connectDB  = require('./config/db');
const expireOldListings = require('./utils/expireListings');

const app    = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
  }
});

const connectedVolunteers = {};

io.on('connection', socket => {
  console.log(`🔌 Socket connected: ${socket.id}`);
  socket.on('register_volunteer', ({ userId }) => {
    connectedVolunteers[userId] = socket.id;
    console.log(`🚴 Volunteer ${userId} registered`);
  });
  socket.on('disconnect', () => {
    Object.keys(connectedVolunteers).forEach(uid => {
      if (connectedVolunteers[uid] === socket.id)
        delete connectedVolunteers[uid];
    });
  });
});

app.set('io', io);
app.set('connectedVolunteers', connectedVolunteers);

app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://feedtheneedy.onrender.com',
  ],
  credentials: true,
}));app.use(express.json());

app.use('/api/auth',     require('./routes/auth'));
app.use('/api/listings', require('./routes/listings'));
app.use('/api/users',    require('./routes/users'));

app.get('/', (req, res) =>
  res.json({ message: '🌾 FeedTheNeedy API running' })
);

app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(500).json({ message: err.message || 'Server Error' });
});

const PORT = process.env.PORT || 5000;

// ✅ Connect DB first THEN start server
connectDB().then(() => {
  server.listen(PORT, () =>
    console.log(`🚀 FeedTheNeedy server running on port ${PORT}`)
  );
  setInterval(expireOldListings, 5 * 60 * 1000);
  expireOldListings();
}).catch(err => {
  console.error('❌ Failed to connect to DB:', err.message);
  process.exit(1);
});