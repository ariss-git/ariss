import { Router } from 'express';
import * as notificationControllers from '../controllers/notification.controller.js';
const notificationRoutes = Router();
notificationRoutes.post('/', notificationControllers.createNotificationController);
notificationRoutes.get('/unread', notificationControllers.fetchAllUnreadNotificationController);
notificationRoutes.get('/', notificationControllers.fetchAllNotificationController);
notificationRoutes.put('/', notificationControllers.readAllNotificationsController);
notificationRoutes.delete('/', notificationControllers.deleteAllNotificationsController);
export default notificationRoutes;
