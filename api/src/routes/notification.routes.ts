import { Router } from 'express';
import * as notificationControllers from '../controllers/notification.controller.js';

const notificationRoutes = Router();

notificationRoutes.post('/', notificationControllers.createNotificationController);
notificationRoutes.get('/', notificationControllers.fetchAllNotificationController);

export default notificationRoutes;
