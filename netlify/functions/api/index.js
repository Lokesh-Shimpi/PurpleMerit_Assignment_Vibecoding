const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
const connectDB = require('./config/db');

const authRoutes = require('./routes/auth');
const pageRoutes = require('./routes/pages');
const publicRoutes = require('./routes/public');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Initialize DB Connection
const initDb = async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (e) {
        res.status(500).json({error: "Database Connection Failed"});
    }
};

app.use(initDb);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/pages', pageRoutes);
app.use('/api/public/pages', publicRoutes);

module.exports.handler = serverless(app);
