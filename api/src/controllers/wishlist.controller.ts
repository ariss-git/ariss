// src/controllers/wishlist.controller.ts

import {
    addToWishlistService,
    deleteWishlistService,
    fetchAllWishlistsService,
    getWishlistProductService,
} from '../services/wishlist.service.js';
import { Request, Response } from 'express';

// Controller to assign wishlist to a product for a dealer
export const addToWishlistController = async (req: Request, res: Response) => {
    try {
        const { dealer_id, product_id } = req.body;

        if (!dealer_id || !product_id) {
            return res.status(404).json({ success: false, message: 'Dealer and Product ID are required' });
        }

        const wishlist = await addToWishlistService(dealer_id, product_id);

        return res.status(201).json({ success: true, data: wishlist });
    } catch (error: any) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Controller to fetch details of the wishlisted product
export const getWishlistProductController = async (req: Request, res: Response) => {
    try {
        const { dealer_id, product_id } = req.params;

        if (!dealer_id || !product_id) {
            return res.status(404).json({ success: false, message: 'Dealer and Product ID are required' });
        }

        const wishlist = await getWishlistProductService(dealer_id, product_id);

        return res.status(200).json({ success: true, data: wishlist });
    } catch (error: any) {
        return res.status(404).json({ success: false, message: error.message });
    }
};

// Controller to delete a wishlist
export const deleteWishlistController = async (req: Request, res: Response) => {
    try {
        const { wishlist_id } = req.params;

        if (!wishlist_id) {
            return res.status(404).json({ success: false, message: 'Wishlist ID are required' });
        }

        const wishlist = await deleteWishlistService(wishlist_id);

        return res.status(200).json({ success: true, data: `${wishlist.wishlist_id} deleted` });
    } catch (error: any) {
        return res.status(400).json({ success: false, message: error.message });
    }
};

// Controller to fetch all wishlists
export const fetchAllWishlistsController = async (_req: Request, res: Response) => {
    try {
        const wishlists = await fetchAllWishlistsService();
        return res.status(200).json({ success: true, total: wishlists.length, data: wishlists });
        return;
    } catch (error: any) {
        return res.status(400).json({ success: false, message: error.message });
    }
};
