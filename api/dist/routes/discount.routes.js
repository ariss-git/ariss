// src/routes/discount.routes.ts
import * as discountControllers from '../controllers/discount.controller.js';
import { Router } from 'express';
const discountRoutes = Router();
// @route POST / - Assign discount to a dealer
discountRoutes.post('/', discountControllers.assignDiscountController);
// @route GET / - Fetch all discounts
discountRoutes.get('/', discountControllers.getAllDiscountsController);
// @route DELETE /:discount_id - Fetch single discount
discountRoutes.delete('/:discount_id', discountControllers.getSingleDiscountController);
// @route DELETE / - Manually delete expired discounts
discountRoutes.delete('/', discountControllers.deleteExpiredDiscountsController);
// @route GET /app/:dealer_id - Fetch all discounts for a dealer
discountRoutes.get('/app/:dealer_id', discountControllers.getAllDiscountsForDealerController);
export default discountRoutes;
