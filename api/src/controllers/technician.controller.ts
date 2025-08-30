// src/controllers/technician.controller.ts

import { AuthRequest } from '../middleware/auth.middleware.js';
import { TechinianService } from '../services/technician.service.js';
import { Request, Response } from 'express';

const techinicianServices = new TechinianService();

/**
 * @desc    Register a new technician
 * @route   POST /register
 * @method  POST
 */
export const registerTechinicianController = async (req: Request, res: Response) => {
    try {
        const { phone, email, first_name, last_name, usertype, dealerId, otp } = req.body;

        if (usertype != 'TECHNICIAN') {
            return res.status(404).json({ success: false, message: 'Select proper type: TECHNICIAN' });
        }

        const technician = await techinicianServices.registerTechinicianService(
            phone,
            email,
            first_name,
            last_name,
            usertype,
            dealerId,
            otp
        );

        return res.status(201).json({ success: true, data: technician });
    } catch (error: any) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @desc    Check if technician is logged in
 * @route   GET /check
 * @method  GET
 */
export const isTechnicianSignedInController = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'Unauthorized: No user found' });
            return;
        }

        const technician = await techinicianServices.isTechnicianSignedIn(req.user.userid);
        if (!technician) {
            res.status(404).json({ message: 'Technician not found' });
            return;
        }

        res.status(200).json(technician);
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @desc    Approve a technician for a dealer
 * @route   PUT /approve/:dealer_id/:tech_id
 * @method  PUT
 */
export const approveTechnicianController = async (req: Request, res: Response) => {
    try {
        const { dealer_id, tech_id } = req.params;

        if (!dealer_id || !tech_id) {
            res.status(404).json({ message: 'Technician or Dealer not found' });
        }

        const technician = await techinicianServices.approveTechnicianService(dealer_id, tech_id);

        return res.status(200).json({ success: true, data: technician });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @desc    Get all approved technicians for a dealer
 * @route   GET /approved/:dealer_id
 * @method  GET
 */
export const getAllApprovedTechniciansController = async (req: Request, res: Response) => {
    try {
        const { dealer_id } = req.params;

        if (!dealer_id) {
            return res.status(404).json({ message: 'Dealer with this ID do not exist' });
        }

        const techinicians = await techinicianServices.getAllApprovedTechniciansService(dealer_id);

        return res.status(200).json({ success: true, total: techinicians.length, data: techinicians });
    } catch (error: any) {
        res.status(404).json({ success: false, message: error.message });
    }
};

/**
 * @desc    Get all disapproved technicians for a dealer
 * @route   GET /disapproved/:dealer_id
 * @method  GET
 */
export const getAllDisapprovedTechniciansController = async (req: Request, res: Response) => {
    try {
        const { dealer_id } = req.params;

        if (!dealer_id) {
            return res.status(404).json({ message: 'Dealer with this ID do not exist' });
        }

        const techinicians = await techinicianServices.getAllDisapprovedTechniciansService(dealer_id);

        return res.status(200).json({ success: true, total: techinicians.length, data: techinicians });
    } catch (error: any) {
        res.status(404).json({ success: false, message: error.message });
    }
};

/**
 * @desc    Disapprove a technician for a dealer
 * @route   PUT /disapprove/:dealer_id/:tech_id
 * @method  PUT
 */
export const disapproveTechnicianController = async (req: Request, res: Response) => {
    try {
        const { dealer_id, tech_id } = req.params;

        if (!dealer_id || !tech_id) {
            res.status(404).json({ message: 'Technician or Dealer not found' });
        }

        const technician = await techinicianServices.disapproveTechnicianService(dealer_id, tech_id);

        return res.status(200).json({ success: true, data: technician });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @desc    Get all technicians associated with a dealer
 * @route   GET /approvals/:dealer_id
 * @method  GET
 */
export const getAllTechniciansForDealerController = async (req: Request, res: Response) => {
    try {
        const { dealer_id } = req.params;

        if (!dealer_id) {
            return res.status(404).json({ success: false, message: 'Dealer ID invalid' });
        }

        const technicians = await techinicianServices.getAllTechniciansForDealer(dealer_id);
        return res.status(200).json({ success: true, total: technicians.length, data: technicians });
    } catch (error: any) {
        return res.status(400).json({ success: false, message: error.message });
    }
};
