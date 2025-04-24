import { config } from '../config/index.js';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
    user?: { userid: string };
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
    const token = req.cookies?.token || req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        res.status(401).json({ message: 'Unauthorized: no token provided' });
        return;
    }

    try {
        const decoded = jwt.verify(token, config.jwtkey) as { id: string };
        console.log('Decoded Token:', decoded); // Debugging

        req.user = { userid: decoded.id }; // Ensure it matches controller expectation
        console.log('Req User after decoding:', req.user);

        next();
    } catch (error) {
        console.error('JWT Verification Error:', error);
        res.status(401).json({ message: 'Invalid token' });
    }
};
