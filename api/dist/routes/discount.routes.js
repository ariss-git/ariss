// src/routes/discount.routes.ts
import { assignDiscountController, deleteExpiredDiscountsController, getAllDiscountsController, getAllDiscountsForDealerController, getSingleDiscountController, } from '../controllers/discount.controller.js';
import { Router } from 'express';
const discountRoutes = Router();
// Assign discount to a dealer route
discountRoutes.post('/', assignDiscountController);
// Fetch all discounts
discountRoutes.get('/', getAllDiscountsController);
// Fetch single discount
discountRoutes.delete('/:discount_id', getSingleDiscountController);
// Manually delete discount route
discountRoutes.delete('/', deleteExpiredDiscountsController);
// Fetch all discounts for a dealer
discountRoutes.get('/app/:dealer_id', getAllDiscountsForDealerController);
export default discountRoutes;
