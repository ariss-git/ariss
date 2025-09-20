// src/server.ts

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { config } from './config/index.js';
import { errorMiddleware } from './middleware/error.middleware.js';
import './middleware/cronjob.middleware.js';

import apiRoutes from './routes/index.js'; // Import centralized routes

const PORT = config.port || 5000;
const app = express();

const corsOptions = {
    origin: ['https://ariss-dashboard.vercel.app', 'http://localhost:5173', 'http://localhost:8081'], // frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
};

// Middleware
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(helmet());
app.use(cookieParser());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Use centralized API routes
app.use('/api', apiRoutes);

// Index route
app.get('/', (req, res) => {
    res.send('Server is working');
});

// Error handling
app.use(errorMiddleware);

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
