import { NotificationService } from '@/services/notification.service.js';
const notificationServices = new NotificationService();
// Controller to create a notification
export const createNotificationController = async (req, res) => {
    const { title, description, panelId, dealerId, technicianId, backofficeId } = req.body;
    const data = { title, description, panelId, dealerId, technicianId, backofficeId };
    try {
        const notification = await notificationServices.createNotificationService(data);
        return res.status(201).json({ success: true, data: notification });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
// Controller to fetch all unread notifications
export const fetchAllUnreadNotificationController = async (_req, res) => {
    try {
        const notification = await notificationServices.fetchAllUnreadNotificationService();
        return res.status(200).json({ success: true, total: notification.length, data: notification });
    }
    catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
};
// Controller to fetch all notifications
export const fetchAllNotificationController = async (_req, res) => {
    try {
        const notification = await notificationServices.fetchAllNotificationService();
        return res.status(200).json({ success: true, total: notification.length, data: notification });
    }
    catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
};
// Controller to read all notifications
export const readAllNotificationsController = async (_req, res) => {
    try {
        const notification = await notificationServices.readAllNotifications();
        return res.status(200).json({ success: true, data: notification });
    }
    catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
};
// Controller to delete all notifications
export const deleteAllNotificationsController = async (_req, res) => {
    try {
        const notification = await notificationServices.deleteAllNotifications();
        return res.status(200).json({ success: true, message: 'Notifications deleted', data: notification });
    }
    catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
};
