import * as adminControllers from '../controllers/admin.controller.js';
import { adminMiddleware } from '../middleware/admin.middleware.js';
import { Router } from 'express';

const adminRoutes = Router();

adminRoutes.post('/register', adminControllers.adminRegisterController);
adminRoutes.post('/login', adminControllers.adminLoginController);
adminRoutes.post('/logout', adminControllers.adminLogoutController);
adminRoutes.get('/profile', adminMiddleware, adminControllers.getAdminProfileController);

export default adminRoutes;
