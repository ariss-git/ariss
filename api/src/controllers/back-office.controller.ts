// src/controllers/back-office.controller.ts

import { AuthRequest } from '../middleware/auth.middleware.js';
import {
    registerBackOfficeService,
    isBackOfficeSignedIn,
    approveBackOfficeService,
    getAllApprovedBackOfficesService,
    getAllDisapprovedBackOfficesService,
    disapproveBackOfficeService,
} from '../services/back-office.service.js';
import { Request, Response } from 'express';

// Controller to register Back Office
export const registerBackOfficeController = async (req: Request, res: Response) => {
    try {
        const { phone, email, first_name, last_name, usertype, dealerId, otp } = req.body;

        if (usertype != 'BACKOFFICE') {
            return res.status(404).json({ success: false, message: 'Select proper type: BACKOFFICE' });
        }

        const backOffice = await registerBackOfficeService(
            phone,
            email,
            first_name,
            last_name,
            usertype,
            dealerId,
            otp
        );

        return res.status(201).json({ success: true, data: backOffice });
    } catch (error: any) {
        return res.status(500).json({ success: false, message: error.message }); // Throw error with message
    }
};

// Controller to check if Back Office is logged in
export const isBackOfficeSignedInController = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'Unauthorized: No user found' });
            return;
        }

        const backOffice = await isBackOfficeSignedIn(req.user.userid);
        if (!backOffice) {
            res.status(404).json({ message: 'Back Office not found' });
            return;
        }

        res.status(200).json(backOffice);
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message }); // Throw error with message
    }
};

// Controller to approve a back office
export const approveBackOfficeController = async (req: Request, res: Response) => {
    try {
        const { dealer_id, backoffice_id } = req.params;

        if (!dealer_id || !backoffice_id) {
            res.status(404).json({ message: 'Back office or Dealer not found' });
        }

        const backOffice = await approveBackOfficeService(dealer_id, backoffice_id);

        return res.status(200).json({ success: true, data: backOffice });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message }); // Throw error with message
    }
};

// Controller to fetch all approved back-offices
export const getAllApprovedBackOfficesController = async (req: Request, res: Response) => {
    try {
        const { dealer_id } = req.params;

        if (!dealer_id) {
            return res.status(404).json({ message: 'Dealer with this ID do not exist' });
        }

        const backOffices = await getAllApprovedBackOfficesService(dealer_id);

        return res.status(200).json({ success: true, total: backOffices.length, data: backOffices });
    } catch (error: any) {
        res.status(404).json({ success: false, message: error.message }); // Throw error with message
    }
};

// Controller to fetch all not-approved back-offices
export const getAllDisapprovedBackOfficesController = async (req: Request, res: Response) => {
    try {
        const { dealer_id } = req.params;

        if (!dealer_id) {
            return res.status(404).json({ message: 'Dealer with this ID do not exist' });
        }

        const backOffices = await getAllDisapprovedBackOfficesService(dealer_id);

        return res.status(200).json({ success: true, total: backOffices.length, data: backOffices });
    } catch (error: any) {
        res.status(404).json({ success: false, message: error.message }); // Throw error with message
    }
};

// Controller to disapprove a back office
export const disapproveBackOfficeController = async (req: Request, res: Response) => {
    try {
        const { dealer_id, backoffice_id } = req.params;

        if (!dealer_id || !backoffice_id) {
            res.status(404).json({ message: 'Back office or Dealer not found' });
        }

        const backOffice = await disapproveBackOfficeService(dealer_id, backoffice_id);

        return res.status(200).json({ success: true, data: backOffice });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message }); // Throw error with message
    }
};
