import { NotificationService } from '@/services/notification.service.js';
import { Request, Response } from 'express';

const notificationServices = new NotificationService();

// Controller to create a notification
export const createNotificationController = async (req: Request, res: Response) => {
    const { title, description, panelId, dealerId, technicianId, backofficeId } = req.body;
    const data = { title, description, panelId, dealerId, technicianId, backofficeId };

    try {
        const notification = await notificationServices.createNotificationService(data);
        return res.status(201).json({ success: true, data: notification });
    } catch (error: any) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Controller to fetch all notifications
export const fetchAllNotificationController = async (_req: Request, res: Response) => {
    try {
        const notification = await notificationServices.fetchAllNotificationService();
        return res.status(200).json({ success: true, data: notification });
    } catch (error: any) {
        return res.status(400).json({ success: false, message: error.message });
    }
};
