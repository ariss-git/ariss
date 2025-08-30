// src/routes/user.routes.ts
import * as userControllers from '../controllers/user.controller.js';
import { Router } from 'express';
const userRoutes = Router();
/**
 * @route   POST /login
 * @desc    Authenticates a user with provided credentials and returns session/token
 * @method  POST
 */
userRoutes.post('/login', userControllers.loginUserController);
/**
 * @route   POST /logout
 * @desc    Logs out the currently authenticated user and invalidates their session/token
 * @method  POST
 */
userRoutes.post('/logout', userControllers.logoutUserController);
export default userRoutes;
