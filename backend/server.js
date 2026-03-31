const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');

// Create Express app
const app = express();

app.use((req, res, next) => {
    process.stdout.write(`[${new Date().toISOString()}] ${req.method} ${req.url} - next is ${typeof next}\n`);
    next();
});

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());

// Database connection
const connectDB = require('./config/db');
connectDB();

// API Routes
app.use('/api/auth', (req, res, next) => {
    console.log('Incoming request to /api/auth:', req.method, req.path);
    next();
}, authRoutes);
app.use('/api/tasks', (req, res, next) => {
    console.log('Incoming request to /api/tasks:', req.method, req.path);
    next();
}, taskRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('SERVER ERROR:', err);
    if (err.stack) console.error(err.stack);
    res.status(500).json({ 
        message: 'Something went wrong!',
        error: err.message || err.toString()
    });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
