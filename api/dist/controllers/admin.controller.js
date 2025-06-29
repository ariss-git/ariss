// src/controllers/admin.controller.ts
import * as adminServices from '../services/admin.service.js';
export const adminRegisterController = async (req, res) => {
    try {
        const { fullname, email, phone, password } = req.body;
        if (!fullname || !email || !phone || !password) {
            return res.status(404).json({
                success: false,
                message: 'Fullname, Email, Phone and Password are not found in body',
            });
        }
        const admin = await adminServices.adminRegisterService(fullname, email, phone, password);
        return res
            .status(201)
            .json({ success: true, data: admin, message: 'Admin account created successfully' });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
export const adminLoginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        const { adminToken, user } = await adminServices.adminLoginService(email, password);
        if (!email || !password) {
            throw new Error('Email and Password fields are required');
        }
        res.cookie('adminToken', adminToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        return res.status(200).json({ success: true, message: 'Admin logged in', adminToken, user });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
export const adminLogoutController = async (_req, res) => {
    try {
        res.clearCookie('adminToken');
        return res.status(200).json({ success: true, message: 'Admin logged out' });
    }
    catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
};
export const getAdminProfileController = async (req, res) => {
    try {
        if (!req.admin) {
            res.status(401).json({ message: 'Unauthorized: No admin found' });
            return;
        }
        const admin = await adminServices.getAdminProfileService(req.admin.admin_id);
        if (!admin) {
            res.status(404).json({ message: 'Admin not found' });
            return;
        }
        res.status(200).json(admin);
    }
    catch (error) {
        res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
};
