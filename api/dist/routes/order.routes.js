// src/routes/order.routes.ts
import { Router } from 'express';
import * as orderControllers from '../controllers/order.controller.js';
const orderRoutes = Router();
// @route   POST /create
// @desc    Route to create a new order
orderRoutes.post('/create', orderControllers.createOrderController);
export default orderRoutes;
