// src/routes/user.routes.ts

import { loginUserController, logoutUserController } from '../controllers/user.controller.js';
import { Router } from 'express';

const userRoutes = Router();

userRoutes.post('/login', loginUserController);
userRoutes.post('/logout', logoutUserController);

export default userRoutes;
