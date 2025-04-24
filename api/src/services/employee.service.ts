// src/services/employee.service.ts

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { config } from '../config/index.js';
import { prisma } from '../db/prismaSingleton.js';

const generateEmployeeToken = (emp_id: string) => {
    return jwt.sign({ emp_id }, config.jwtkey!, { expiresIn: '7d' });
};

export const employeeRegisterService = async (
    fullname: string,
    email: string,
    phone: string,
    password: string
) => {
    const existingEmployee = await prisma.employee.findUnique({
        where: { email },
    });

    if (existingEmployee) throw new Error('Employee with this email already exists');

    const hashedPassword = await bcrypt.hash(password, 10);
    return await prisma.employee.create({
        data: {
            fullname,
            phone,
            email,
            password: hashedPassword,
        },
    });
};

export const employeeLoginService = async (email: string, password: string) => {
    const user = await prisma.employee.findUnique({
        where: {
            email,
        },
    });

    if (!user) throw new Error('Employee with this email do not exist');

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new Error('Wrong password');

    const empToken = generateEmployeeToken(user.emp_id);
    return { empToken, user };
};

export const getEmployeeProfileService = async (emp_id: string) => {
    return await prisma.employee.findUnique({
        where: {
            emp_id,
        },
    });
};

export const getAllApprovedEmployeesService = async () => {
    const approvedEmployyes = await prisma.employee.findMany({
        where: {
            isApproved: true,
        },
    });

    if (!approvedEmployyes) throw new Error('Approved employees not found');

    return approvedEmployyes;
};

export const getAllDispprovedEmployeesService = async () => {
    const disapprovedEmployyes = await prisma.employee.findMany({
        where: {
            isApproved: false,
        },
    });

    if (!disapprovedEmployyes) throw new Error('Disapproved employees not found');

    return disapprovedEmployyes;
};

export const approvedEmployeeService = async (emp_id: string) => {
    const existingEmployee = await prisma.employee.findUnique({
        where: {
            emp_id,
        },
    });

    if (!existingEmployee) throw new Error('Employee not found');

    return await prisma.employee.update({
        where: {
            emp_id,
        },
        data: {
            isApproved: true,
        },
    });
};

export const disapprovedEmployeeService = async (emp_id: string) => {
    const existingEmployee = await prisma.employee.findUnique({
        where: {
            emp_id,
        },
    });

    if (!existingEmployee) throw new Error('Employee not found');

    return await prisma.employee.update({
        where: {
            emp_id,
        },
        data: {
            isApproved: false,
        },
    });
};
