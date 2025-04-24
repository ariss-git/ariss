// src/services/admin.service.ts

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { config } from '../config/index.js';
import { prisma } from '../db/prismaSingleton.js';

const generateAdminToken = (admin_id: string) => {
    return jwt.sign({ admin_id }, config.jwtkey!, { expiresIn: '7d' });
};

export const adminRegisterService = async (
    fullname: string,
    email: string,
    phone: string,
    password: string
) => {
    const existingAdmin = await prisma.admin.findUnique({
        where: { email },
    });

    if (existingAdmin) throw new Error('Admin with this email already exists');

    const hashedPassword = await bcrypt.hash(password, 10);
    return await prisma.admin.create({
        data: {
            fullname,
            phone,
            email,
            password: hashedPassword,
        },
    });
};

export const adminLoginService = async (email: string, password: string) => {
    const user = await prisma.admin.findUnique({
        where: {
            email,
        },
    });

    if (!user) throw new Error('Admin with this email do not exist');

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new Error('Wrong password');

    const adminToken = generateAdminToken(user.admin_id);
    return { adminToken, user };
};

export const getAdminProfileService = async (admin_id: string) => {
    return await prisma.admin.findUnique({
        where: {
            admin_id,
        },
    });
};
