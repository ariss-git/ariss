// src/controllers/back-office.controller.ts
import { BackOfficeService } from '../services/back-office.service.js';
const backOfficeServices = new BackOfficeService();
/**
 * @controller registerBackOfficeController
 * @route POST /back-office/register
 * @desc Register a new back-office user
 */
export const registerBackOfficeController = async (req, res) => {
    try {
        const { phone, email, first_name, last_name, usertype, dealerId, otp } = req.body;
        // Ensure only BACKOFFICE usertype is allowed
        if (usertype != 'BACKOFFICE') {
            return res.status(404).json({ success: false, message: 'Select proper type: BACKOFFICE' });
        }
        const backOffice = await backOfficeServices.registerBackOfficeService(phone, email, first_name, last_name, usertype, dealerId, otp);
        return res.status(201).json({ success: true, data: backOffice });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
/**
 * @controller isBackOfficeSignedInController
 * @route GET /back-office/check
 * @desc Verify if a back-office user is logged in
 */
export const isBackOfficeSignedInController = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'Unauthorized: No user found' });
            return;
        }
        const backOffice = await backOfficeServices.isBackOfficeSignedIn(req.user.userid);
        if (!backOffice) {
            res.status(404).json({ message: 'Back Office not found' });
            return;
        }
        res.status(200).json(backOffice);
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
/**
 * @controller approveBackOfficeController
 * @route PUT /back-office/approve/:dealer_id/:backoffice_id
 * @desc Approve a back-office user for a dealer
 */
export const approveBackOfficeController = async (req, res) => {
    try {
        const { dealer_id, backoffice_id } = req.params;
        if (!dealer_id || !backoffice_id) {
            res.status(404).json({ message: 'Back office or Dealer not found' });
        }
        const backOffice = await backOfficeServices.approveBackOfficeService(dealer_id, backoffice_id);
        return res.status(200).json({ success: true, data: backOffice });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
/**
 * @controller getAllApprovedBackOfficesController
 * @route GET /back-office/approved/:dealer_id
 * @desc Fetch all approved back-office users for a dealer
 */
export const getAllApprovedBackOfficesController = async (req, res) => {
    try {
        const { dealer_id } = req.params;
        if (!dealer_id) {
            return res.status(404).json({ message: 'Dealer with this ID does not exist' });
        }
        const backOffices = await backOfficeServices.getAllApprovedBackOfficesService(dealer_id);
        return res.status(200).json({ success: true, total: backOffices.length, data: backOffices });
    }
    catch (error) {
        res.status(404).json({ success: false, message: error.message });
    }
};
/**
 * @controller getAllDisapprovedBackOfficesController
 * @route GET /back-office/disapproved/:dealer_id
 * @desc Fetch all disapproved back-office users for a dealer
 */
export const getAllDisapprovedBackOfficesController = async (req, res) => {
    try {
        const { dealer_id } = req.params;
        if (!dealer_id) {
            return res.status(404).json({ message: 'Dealer with this ID does not exist' });
        }
        const backOffices = await backOfficeServices.getAllDisapprovedBackOfficesService(dealer_id);
        return res.status(200).json({ success: true, total: backOffices.length, data: backOffices });
    }
    catch (error) {
        res.status(404).json({ success: false, message: error.message });
    }
};
/**
 * @controller disapproveBackOfficeController
 * @route PUT /back-office/disapprove/:dealer_id/:backoffice_id
 * @desc Disapprove a back-office user for a dealer
 */
export const disapproveBackOfficeController = async (req, res) => {
    try {
        const { dealer_id, backoffice_id } = req.params;
        if (!dealer_id || !backoffice_id) {
            res.status(404).json({ message: 'Back office or Dealer not found' });
        }
        const backOffice = await backOfficeServices.disapproveBackOfficeService(dealer_id, backoffice_id);
        return res.status(200).json({ success: true, data: backOffice });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
/**
 * @controller getAllBackofficesForDealerController
 * @route GET /back-office/approvals/:dealer_id
 * @desc Fetch all back-office users (approved and disapproved) for a dealer
 */
export const getAllBackofficesForDealerController = async (req, res) => {
    try {
        const { dealer_id } = req.params;
        if (!dealer_id) {
            res.status(404).json({ success: false, message: 'Dealer ID invalid' });
        }
        const backoffices = await backOfficeServices.getAllBackofficesForDealer(dealer_id);
        return res.status(200).json({ success: true, total: backoffices.length, data: backoffices });
    }
    catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
};
