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

// Middleware
app.use(
    cors({
        origin: ['http://localhost:8081', 'http://localhost:5173', 'https://admin-ariss.vercel.app'],
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    })
);
app.use(helmet());
app.use(cookieParser());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Use centralized API routes
app.use('/api', apiRoutes);

// Index route
app.get('/', (_req, res) => {
    res.send('Server is working');
});

// Error handling
app.use(errorMiddleware);

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
