import { Router } from 'express';
import { createOrderController } from '../controllers/order.controller.js';

const orderRoutes = Router();

// Route for creating a new order
orderRoutes.post('/create', createOrderController);

export default orderRoutes;
