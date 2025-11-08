// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: { origin: "http://localhost:3000" }
});

app.use(cors());
app.use(express.json());

// MongoDB Connection (use MongoDB Atlas for production)
mongoose.connect('mongodb://localhost:27017/skillshare');

// Models
const User = require('./models/User');
const Project = require('./models/Project');

// JWT Secret
const JWT_SECRET = 'your_strong_secret_here';

// Socket.IO: Real-time chat
io.on('connection', (socket) => {
  socket.on('join-room', (roomId) => {
    socket.join(roomId);
  });

  socket.on('send-message', ({ roomId, senderId, text }) => {
    io.to(roomId).emit('receive-message', { senderId, text, timestamp: new Date() });
  });
});

// Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashed, skills: [], projects: [] });
    await user.save();
    res.status(201).json({ id: user._id, username: user.username });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user._id }, JWT_SECRET);
    res.json({ token, user: { id: user._id, username: user.username } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Protected routes (add JWT middleware)
app.use('/api', (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

app.get('/api/profile', async (req, res) => {
  const user = await User.findById(req.userId).select('-password');
  res.json(user);
});

app.put('/api/profile', async (req, res) => {
  const { bio, skills } = req.body;
  const user = await User.findByIdAndUpdate(
    req.userId,
    { bio, skills },
    { new: true }
  ).select('-password');
  res.json(user);
});

app.post('/api/projects', async (req, res) => {
  const { title, description, neededSkills } = req.body;
  const project = new Project({ 
    owner: req.userId, 
    title, 
    description, 
    neededSkills 
  });
  await project.save();
  res.status(201).json(project);
});

app.get('/api/skills', async (req, res) => {
  const users = await User.find({ skills: { $ne: [] } }).select('username skills');
  const allSkills = users.flatMap(u => u.skills);
  const unique = [...new Set(allSkills)];
  res.json(unique);
});

server.listen(5000, () => console.log('Backend running on http://localhost:5000'));