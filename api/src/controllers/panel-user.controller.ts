// src/services/panel-user.controller.ts

import { PanelUserService } from '@/services/panel-user.service.js';
import { Request, Response } from 'express';

const panelUserServices = new PanelUserService();

export const createPanelUserController = async (req: Request, res: Response) => {
    const { panelId, email, name, profilePic, panelType } = req.body;

    if (!panelId || !email || !name || !panelType) {
        return res.status(404).json({ success: false, message: 'All fields are required' });
    }

    try {
        const panelUser = await panelUserServices.createPanelUserService(
            panelId,
            email,
            name,
            profilePic,
            panelType
        );

        return res.status(201).json({ success: true, data: panelUser });
    } catch (error: any) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const getAllPanelAdminsController = async (_req: Request, res: Response) => {
    try {
        const panelUser = await panelUserServices.getAllPanelAdminsService();

        return res.status(200).json({ success: true, total: panelUser.length, data: panelUser });
    } catch (error: any) {
        return res.status(400).json({ success: false, message: error.message });
    }
};

export const getAllPanelEmployeesController = async (_req: Request, res: Response) => {
    try {
        const panelUser = await panelUserServices.getAllPanelEmployeesService();

        return res.status(200).json({ success: true, total: panelUser.length, data: panelUser });
    } catch (error: any) {
        return res.status(400).json({ success: false, message: error.message });
    }
};
