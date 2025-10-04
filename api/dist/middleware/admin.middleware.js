// src/middleware/admin.middleware.ts
import { config } from '../config/index.js';
import jwt from 'jsonwebtoken';
export const adminMiddleware = (req, res, next) => {
    const adminToken = req.cookies?.adminToken || req.header('Authorization')?.replace('Bearer ', '');
    if (!adminToken) {
        res.status(401).json({ message: 'Unauthorized: No token provided' });
        return;
    }
    try {
        const decoded = jwt.verify(adminToken, config.jwtkey);
        req.admin = decoded;
        next();
    }
    catch (error) {
        res.status(401).json({ message: 'Invalid token' });
        return;
    }
};
