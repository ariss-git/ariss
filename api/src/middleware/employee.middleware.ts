// src/middleware/employee.middleware.ts

import { config } from '../config/index.js';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface EmployeeAuthRequest extends Request {
    employee?: { emp_id: string };
}

export const employeeMiddleware = (req: EmployeeAuthRequest, res: Response, next: NextFunction): void => {
    const employeeToken = req.cookies?.employeeToken || req.header('Authorization')?.replace('Bearer ', '');

    if (!employeeToken) {
        res.status(401).json({ message: 'Unauthorized: No token provided' });
        return;
    }

    try {
        const decoded = jwt.verify(employeeToken, config.jwtkey!) as { emp_id: string };
        req.employee = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
        return;
    }
};
