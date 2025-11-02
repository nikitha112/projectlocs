const express = require('express');
const cors = require('cors');
const path = require('path');
const itemRoutes = require('./routes/items');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/items', itemRoutes);

// Default route
app.get('/', (req, res) => res.send('Lost & Found API running'));

module.exports = app;
