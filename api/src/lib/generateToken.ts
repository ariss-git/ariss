// src/lib/generateToken.ts

import { config } from '../config/index.js';
import jwt from 'jsonwebtoken';

// Access token to generate session for login
export const generateToken = (id: string): string => {
    return jwt.sign({ id }, config.jwtkey, { expiresIn: '7d' });
};
