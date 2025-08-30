// src/controllers/rma.controller.ts

import { RMAService } from '../services/rma.service.js';
import { Request, Response } from 'express';

const rmaServices = new RMAService();

/**
 * @desc Handles RMA form submission
 * @route POST /rma
 */
export const rmaRequestFormController = async (req: Request, res: Response) => {
    try {
        // Extract and structure RMA form data from request body
        const rmaData = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            business_name: req.body.business_name,
            gstin: req.body.gstin,
            phone: req.body.phone,
            email: req.body.email,
            user_type: req.body.user_type,
            product_name: req.body.product_name,
            product_serial: req.body.product_serial,
            product_issue: req.body.product_issue,
            product_images: req.body.product_images,
        };

        // Basic guard clause for missing body (should ideally be handled by validation middleware)
        if (!rmaData) {
            return res.status(404).json({ success: false, message: 'Missing required fields' });
        }

        // Create new RMA request
        const rma = await rmaServices.rmaRequestFormService(rmaData);

        return res.status(201).json({ success: true, data: rma });
    } catch (error: any) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @desc Updates RMA request status to "Accepted"
 * @route PUT /rma/accept/:rma_id
 */
export const rmaRequestAcceptedController = async (req: Request, res: Response) => {
    try {
        const { rma_id } = req.params;

        if (!rma_id) {
            return res.status(404).json({ success: false, message: 'Invalid or Incorrect RMA ID' });
        }

        const rma = await rmaServices.rmaRequestAcceptedService(rma_id);

        return res.status(200).json({ success: true, message: 'Updated RMA Status: Accepted', data: rma });
    } catch (error: any) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @desc Updates RMA request status to "Rejected"
 * @route PUT /rma/reject/:rma_id
 */
export const rmaRequestRejectedController = async (req: Request, res: Response) => {
    try {
        const { rma_id } = req.params;

        if (!rma_id) {
            return res.status(404).json({ success: false, message: 'Invalid or Incorrect RMA ID' });
        }

        const rma = await rmaServices.rmaRequestRejectedService(rma_id);

        return res.status(200).json({ success: true, message: 'Updated RMA Status: Rejected', data: rma });
    } catch (error: any) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @desc Updates RMA request status to "Resolved"
 * @route PUT /rma/resolve/:rma_id
 */
export const rmaRequestResolvedController = async (req: Request, res: Response) => {
    try {
        const { rma_id } = req.params;

        if (!rma_id) {
            return res.status(404).json({ success: false, message: 'Invalid or Incorrect RMA ID' });
        }

        const rma = await rmaServices.rmaRequestResolvedService(rma_id);

        return res.status(200).json({ success: true, message: 'Updated RMA Status: Resolved', data: rma });
    } catch (error: any) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @desc Retrieves all RMA requests
 * @route GET /rma
 */
export const getAllRMAController = async (_req: Request, res: Response) => {
    try {
        const rma = await rmaServices.getAllRMAService();

        return res.status(200).json({ success: true, total: rma.length, data: rma });
    } catch (error: any) {
        return res.status(400).json({ success: false, message: error.message });
    }
};

/**
 * @desc Retrieves a single RMA request by ID
 * @route GET /rma/:rma_id
 */
export const getSingleRMAController = async (req: Request, res: Response) => {
    try {
        const { rma_id } = req.params;

        if (!rma_id) {
            return res.status(404).json({ success: false, message: 'Invalid or Incorrect RMA ID' });
        }

        const rma = await rmaServices.getSingleRMAService(rma_id);

        return res.status(200).json({ success: true, data: rma });
    } catch (error: any) {
        return res.status(400).json({ success: false, message: error.message });
    }
};

/**
 * @desc Deletes a specific RMA request
 * @route DELETE /rma/:rma_id
 */
export const deleteRMARequestController = async (req: Request, res: Response) => {
    try {
        const { rma_id } = req.params;

        if (!rma_id) {
            return res.status(404).json({ success: false, message: 'Invalid or Incorrect RMA ID' });
        }

        const rma = await rmaServices.deleteRMARequestService(rma_id);

        return res.status(200).json({ success: true, message: 'RMA request deleted', data: rma });
    } catch (error: any) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
