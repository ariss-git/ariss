// src/routes/otp.router.ts
import { sendOTPController } from '../controllers/otp.controller.js';
import { Router } from 'express';
const otpRoutes = Router();
otpRoutes.post('/', sendOTPController);
export default otpRoutes;
