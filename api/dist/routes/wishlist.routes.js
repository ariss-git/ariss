// src/routes/wishlist.routes.ts
import { addToWishlistController, deleteWishlistController, fetchAllWishlistsController, getWishlistProductController, } from '../controllers/wishlist.controller.js';
import { Router } from 'express';
const wishlistRoutes = Router();
wishlistRoutes.post('/', addToWishlistController);
wishlistRoutes.get('/', fetchAllWishlistsController);
wishlistRoutes.get('/:dealer_id/:product_id', getWishlistProductController);
wishlistRoutes.delete('/:wishlist_id', deleteWishlistController);
export default wishlistRoutes;
