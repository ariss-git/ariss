// src/controllers/employee.controller.ts

import { EmployeeAuthRequest } from '../middleware/employee.middleware.js';
import * as employeeServices from '../services/employee.service.js';
import { Request, Response } from 'express';

export const employeeRegisterController = async (req: Request, res: Response) => {
    try {
        const { fullname, email, phone, password } = req.body;

        if (!fullname || !email || !phone || !password) {
            return res.status(404).json({
                success: false,
                message: 'Fullname, Email, Phone and Password are not found in body',
            });
        }
        const employee = await employeeServices.employeeRegisterService(fullname, email, phone, password);

        return res
            .status(201)
            .json({ success: true, data: employee, message: 'Employee account created successfully' });
    } catch (error: any) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const employeeLoginController = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const { empToken, user } = await employeeServices.employeeLoginService(email, password);

        if (!email || !password) {
            throw new Error('Email and Password fields are required');
        }

        res.cookie('empToken', empToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        return res.status(200).json({ success: true, message: 'Employee logged in', empToken, user });
    } catch (error: any) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const employeeLogoutController = async (_req: Request, res: Response) => {
    try {
        res.clearCookie('empToken');
        return res.status(200).json({ success: true, message: 'Employee logged out' });
    } catch (error: any) {
        return res.status(400).json({ success: false, message: error.message });
    }
};

export const getEmployeeProfileController = async (
    req: EmployeeAuthRequest,
    res: Response
): Promise<void> => {
    try {
        if (!req.employee) {
            res.status(401).json({ message: 'Unauthorized: No admin found' });
            return;
        }

        const employee = await employeeServices.getEmployeeProfileService(req.employee.emp_id);

        if (!employee) {
            res.status(404).json({ message: 'Employee not found' });
            return;
        }

        res.status(200).json(employee);
    } catch (error: any) {
        res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
};

export const getAllApprovedEmployeesController = async (_req: Request, res: Response) => {
    try {
        const employees = await employeeServices.getAllApprovedEmployeesService();
        return res.status(200).json({ success: true, totat: employees.length, data: employees });
    } catch (error: any) {
        return res.status(400).json({ success: false, error: error.message });
    }
};

export const getAllDispprovedEmployeesController = async (_req: Request, res: Response) => {
    try {
        const employees = await employeeServices.getAllDispprovedEmployeesService();
        return res.status(200).json({ success: true, totat: employees.length, data: employees });
    } catch (error: any) {
        return res.status(400).json({ success: false, error: error.message });
    }
};

export const approvedEmployeeController = async (req: Request, res: Response) => {
    try {
        const { emp_id } = req.params;

        if (!emp_id) {
            return res.status(404).json({ success: false, meesage: 'Employee with this ID is invalid' });
        }

        const employee = await employeeServices.approvedEmployeeService(emp_id);
        return res.status(200).json({ success: true, message: 'Approval successful', data: employee });
    } catch (error: any) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

export const disapprovedEmployeeController = async (req: Request, res: Response) => {
    try {
        const { emp_id } = req.params;

        if (!emp_id) {
            return res.status(404).json({ success: false, meesage: 'Employee with this ID is invalid' });
        }

        const employee = await employeeServices.disapprovedEmployeeService(emp_id);
        return res.status(200).json({ success: true, message: 'Disapproval successful', data: employee });
    } catch (error: any) {
        return res.status(500).json({ success: false, error: error.message });
    }
};
