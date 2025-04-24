// src/middleware/admin.middleware.ts

import { config } from '../config/index.js';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AdminAuthRequest extends Request {
    admin?: { admin_id: string };
}

export const adminMiddleware = (req: AdminAuthRequest, res: Response, next: NextFunction): void => {
    const adminToken = req.cookies?.adminToken || req.header('Authorization')?.replace('Bearer ', '');

    if (!adminToken) {
        res.status(401).json({ message: 'Unauthorized: No token provided' });
        return;
    }

    try {
        const decoded = jwt.verify(adminToken, config.jwtkey!) as { admin_id: string };
        req.admin = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
        return;
    }
};
