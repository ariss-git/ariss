// src/middleware/employee.middleware.ts
import { config } from '../config/index.js';
import jwt from 'jsonwebtoken';
export const employeeMiddleware = (req, res, next) => {
    const employeeToken = req.cookies?.employeeToken || req.header('Authorization')?.replace('Bearer ', '');
    if (!employeeToken) {
        res.status(401).json({ message: 'Unauthorized: No token provided' });
        return;
    }
    try {
        const decoded = jwt.verify(employeeToken, config.jwtkey);
        req.employee = decoded;
        next();
    }
    catch (error) {
        res.status(401).json({ message: 'Invalid token' });
        return;
    }
};
